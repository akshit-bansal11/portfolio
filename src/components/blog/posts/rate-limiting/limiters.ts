/*
 * limiters.ts
 * Small, pure implementations of the five classic rate-limiting
 * algorithms, used by the Rate Limiting demo. Every limiter
 * answers the same question: "a request arrives at time t
 * (seconds) — accept it, queue it, or reject it?" and exposes a
 * snapshot of its internal state for drawing.
 */

export type AlgorithmId =
  | "tokenBucket"
  | "fixedWindow"
  | "slidingLog"
  | "slidingCounter"
  | "leakyBucket";

export interface Decision {
  outcome: "accepted" | "queued" | "rejected";
  /** Seconds the client should wait before retrying (rejected only). */
  retryAfter?: number;
  /** Seconds the request waits in the queue before being processed (queued only). */
  waits?: number;
}

/** What the demo draws for each algorithm. */
export interface Snapshot {
  /** 0..1 "how full / how much is left" for the gauge. */
  level: number;
  /** Short handwritten-style readout, e.g. "3.4 tokens left". */
  readout: string;
}

export interface Limiter {
  tryRequest(t: number): Decision;
  snapshot(t: number): Snapshot;
}

/** Shared settings: on average `rate` requests per second, with bursts up to `burst`. */
export interface LimiterConfig {
  rate: number;
  burst: number;
}

/** Tokens drip into a bucket at `rate`/s up to `burst`; each request spends one. */
class TokenBucket implements Limiter {
  private tokens: number;
  private last = 0;
  constructor(private config: LimiterConfig) {
    this.tokens = config.burst;
  }
  private refill(t: number) {
    this.tokens = Math.min(this.config.burst, this.tokens + (t - this.last) * this.config.rate);
    this.last = t;
  }
  tryRequest(t: number): Decision {
    this.refill(t);
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return { outcome: "accepted" };
    }
    return { outcome: "rejected", retryAfter: (1 - this.tokens) / this.config.rate };
  }
  snapshot(t: number): Snapshot {
    const tokens = Math.min(this.config.burst, this.tokens + (t - this.last) * this.config.rate);
    return {
      level: tokens / this.config.burst,
      readout: `${tokens.toFixed(1)} of ${this.config.burst} tokens`,
    };
  }
}

/** Count requests per fixed calendar window; reset at each boundary. */
class FixedWindow implements Limiter {
  private windowStart = 0;
  private count = 0;
  private readonly window: number;
  constructor(private config: LimiterConfig) {
    this.window = config.burst / config.rate;
  }
  private roll(t: number) {
    const start = Math.floor(t / this.window) * this.window;
    if (start !== this.windowStart) {
      this.windowStart = start;
      this.count = 0;
    }
  }
  tryRequest(t: number): Decision {
    this.roll(t);
    if (this.count < this.config.burst) {
      this.count += 1;
      return { outcome: "accepted" };
    }
    return { outcome: "rejected", retryAfter: this.windowStart + this.window - t };
  }
  snapshot(t: number): Snapshot {
    const start = Math.floor(t / this.window) * this.window;
    const count = start === this.windowStart ? this.count : 0;
    const resetsIn = start + this.window - t;
    return {
      level: 1 - count / this.config.burst,
      readout: `${count}/${this.config.burst} used · resets in ${resetsIn.toFixed(1)}s`,
    };
  }
}

/** Remember the timestamp of every accepted request in the last window. Exact, memory-hungry. */
class SlidingLog implements Limiter {
  private log: number[] = [];
  private readonly window: number;
  constructor(private config: LimiterConfig) {
    this.window = config.burst / config.rate;
  }
  private purge(t: number) {
    this.log = this.log.filter((stamp) => stamp > t - this.window);
  }
  tryRequest(t: number): Decision {
    this.purge(t);
    if (this.log.length < this.config.burst) {
      this.log.push(t);
      return { outcome: "accepted" };
    }
    return { outcome: "rejected", retryAfter: this.log[0] + this.window - t };
  }
  snapshot(t: number): Snapshot {
    const live = this.log.filter((stamp) => stamp > t - this.window).length;
    return {
      level: 1 - live / this.config.burst,
      readout: `${live} timestamps stored in the last ${this.window.toFixed(1)}s`,
    };
  }
}

/** Two counters (previous + current window), weighted by overlap. Cloudflare-style approximation. */
class SlidingCounter implements Limiter {
  private currentStart = 0;
  private current = 0;
  private previous = 0;
  private readonly window: number;
  constructor(private config: LimiterConfig) {
    this.window = config.burst / config.rate;
  }
  private roll(t: number) {
    const start = Math.floor(t / this.window) * this.window;
    if (start === this.currentStart) return;
    // If we skipped a whole window, the previous one was empty.
    this.previous = Math.round((start - this.currentStart) / this.window) === 1 ? this.current : 0;
    this.current = 0;
    this.currentStart = start;
  }
  private estimate(t: number) {
    const elapsed = (t - this.currentStart) / this.window;
    return this.previous * (1 - elapsed) + this.current;
  }
  tryRequest(t: number): Decision {
    this.roll(t);
    if (this.estimate(t) + 1 <= this.config.burst) {
      this.current += 1;
      return { outcome: "accepted" };
    }
    // The estimate falls as the previous window's weight fades.
    const excess = this.estimate(t) + 1 - this.config.burst;
    const wait =
      this.previous > 0
        ? (excess / this.previous) * this.window
        : this.currentStart + this.window - t;
    return { outcome: "rejected", retryAfter: Math.max(0.1, wait) };
  }
  snapshot(t: number): Snapshot {
    const start = Math.floor(t / this.window) * this.window;
    const sameWindow = start === this.currentStart;
    const previous = sameWindow
      ? this.previous
      : Math.round((start - this.currentStart) / this.window) === 1
        ? this.current
        : 0;
    const current = sameWindow ? this.current : 0;
    const estimate = previous * (1 - (t - start) / this.window) + current;
    return {
      level: Math.max(0, 1 - estimate / this.config.burst),
      readout: `${previous} × ${(1 - (t - start) / this.window).toFixed(2)} + ${current} ≈ ${estimate.toFixed(1)} of ${this.config.burst}`,
    };
  }
}

/** Requests join a queue that drains at a steady `rate`; if the queue is full, reject. */
class LeakyBucket implements Limiter {
  private level = 0;
  private last = 0;
  constructor(private config: LimiterConfig) {}
  private leak(t: number) {
    this.level = Math.max(0, this.level - (t - this.last) * this.config.rate);
    this.last = t;
  }
  tryRequest(t: number): Decision {
    this.leak(t);
    if (this.level + 1 <= this.config.burst) {
      const waits = this.level / this.config.rate;
      this.level += 1;
      return waits < 0.05 ? { outcome: "accepted" } : { outcome: "queued", waits };
    }
    return {
      outcome: "rejected",
      retryAfter: (this.level + 1 - this.config.burst) / this.config.rate,
    };
  }
  snapshot(t: number): Snapshot {
    const level = Math.max(0, this.level - (t - this.last) * this.config.rate);
    return {
      level: 1 - level / this.config.burst,
      readout: `${level.toFixed(1)} of ${this.config.burst} queued · drains ${this.config.rate}/s`,
    };
  }
}

export const ALGORITHMS: Record<
  AlgorithmId,
  { label: string; create: (config: LimiterConfig) => Limiter }
> = {
  tokenBucket: { label: "Token bucket", create: (config) => new TokenBucket(config) },
  fixedWindow: { label: "Fixed window", create: (config) => new FixedWindow(config) },
  slidingLog: { label: "Sliding log", create: (config) => new SlidingLog(config) },
  slidingCounter: { label: "Sliding counter", create: (config) => new SlidingCounter(config) },
  leakyBucket: { label: "Leaky bucket", create: (config) => new LeakyBucket(config) },
};
