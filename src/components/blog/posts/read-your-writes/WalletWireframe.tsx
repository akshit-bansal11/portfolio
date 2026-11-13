/*
 * WalletWireframe.tsx
 * Three hand-drawn phone wireframes of a wallet app: add ₹100, see "added", refresh and
 * see the balance. In the "bug" variant the refresh is served by a replica that has not
 * caught up, so the balance reads ₹0. In the "fixed" variant it reads ₹100. Each phone
 * says which database node answered it. Server-rendered; motion is CSS only.
 */

import { CheckCircle2, RefreshCw, Wallet } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Link, Row } from "@/components/tutorials/Diagram";
import type { Tone } from "@/components/tutorials/Flow";
import { sketchEllipse } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const CIRCLE = sketchEllipse(100, 32, 92, 28, { seed: 7 });

interface PhoneProps {
  step: string;
  server: string;
  serverTone: Tone;
  children: ReactNode;
}

// One phone: handwritten step label, sketched outline, fake status bar, screen, and a chip
// saying which node served this screen.
function Phone({ step, server, serverTone, children }: PhoneProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <p className="font-hand text-2xl leading-none font-bold text-ink">{step}</p>
      <div className="tut-sketch-alt w-full max-w-[16rem] border-[2.5px] border-ink bg-paper p-2">
        <div className="flex min-h-[19rem] flex-col rounded-[1.1rem] border border-rule bg-paper-raised p-3">
          <div
            aria-hidden
            className="mb-3 flex items-center justify-between text-[0.65rem] text-ink-muted"
          >
            <span className="font-semibold">9:41</span>
            <span className="h-1.5 w-12 rounded-full bg-rule" />
            <span>●●● ▮</span>
          </div>
          <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-ink">
            <Wallet className="h-4 w-4" aria-hidden /> PayWallet
          </p>
          {children}
        </div>
      </div>
      <p
        data-tone={serverTone}
        className="rounded-full border border-(--tone) bg-(--tone-soft) px-2.5 py-0.5 text-xs font-semibold text-(--tone)"
      >
        answered by: {server}
      </p>
    </div>
  );
}

export default function WalletWireframe({ variant = "bug" }: { variant?: "bug" | "fixed" }) {
  const fixed = variant === "fixed";

  return (
    <figure className="my-10">
      <div className="tut-paper rounded-md border border-rule p-4 pl-6 sm:p-8 sm:pl-14">
        <Row>
          <Phone step="1. add money" server="primary" serverTone="pink">
            <p className="text-xs text-ink-muted">Amount</p>
            <p className="mt-1 rounded-lg border border-rule bg-paper px-3 py-2 text-2xl font-bold text-ink">
              ₹ 100
            </p>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="rounded-full border border-rule px-2 py-0.5 text-ink-muted">
                +₹100
              </span>
              <span className="rounded-full border border-rule px-2 py-0.5 text-ink-muted">
                +₹500
              </span>
            </div>
            <span
              data-tone="green"
              className="tut-ping mt-auto block rounded-xl bg-(--tone) py-2.5 text-center text-sm font-bold text-paper"
            >
              Add ₹100
            </span>
          </Phone>

          <Link dir="right" label="UPDATE goes to the primary" tone="pink" seed={4} />

          <Phone step="2. success!" server="primary" serverTone="pink">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span data-tone="green" className="tut-pop text-(--tone)">
                <CheckCircle2 className="h-14 w-14" aria-hidden />
              </span>
              <p className="mt-3 font-bold text-ink">₹100 added</p>
              <p className="mt-1 text-xs text-ink-muted">Txn #8812 · just now</p>
            </div>
            <span className="mt-auto block rounded-xl border border-rule py-2 text-center text-sm font-semibold text-ink">
              Go to wallet
            </span>
          </Phone>

          <Link
            dir="right"
            label={fixed ? "refresh, routed safely" : "refresh 0.1 s later"}
            tone={fixed ? "green" : "red"}
            seed={9}
          />

          <Phone
            step={fixed ? "3. refresh: correct" : "3. refresh: ???"}
            server={fixed ? "replica 1 (caught up)" : "replica 2 (behind)"}
            serverTone={fixed ? "green" : "red"}
          >
            <p className="flex items-center gap-1.5 text-xs text-ink-muted">
              <RefreshCw className="h-3 w-3" aria-hidden /> Wallet balance
            </p>
            <div className="relative mt-1 w-fit">
              <p
                data-tone={fixed ? "green" : "red"}
                style={{ "--delay": "0.6s" } as CSSProperties}
                className={cn("text-4xl font-bold text-(--tone)", !fixed && "tut-shake")}
              >
                {fixed ? "₹100.00" : "₹0.00"}
              </p>
              {!fixed && (
                <svg
                  aria-hidden
                  viewBox="0 0 200 64"
                  data-tone="red"
                  className="pointer-events-none absolute -inset-x-5 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2.5rem)] overflow-visible text-(--tone)"
                  preserveAspectRatio="none"
                >
                  <path
                    d={CIRCLE}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            {!fixed && (
              <p data-tone="red" className="mt-2 font-hand text-xl leading-5 text-(--tone)">
                wait... where did my ₹100 go?
              </p>
            )}
            <p className="mt-4 text-xs font-semibold text-ink-muted">Recent</p>
            {fixed ? (
              <p className="mt-1 flex justify-between rounded-lg border border-rule bg-paper px-2 py-1.5 text-xs text-ink">
                <span>Added money</span>
                <span data-tone="green" className="font-bold text-(--tone)">
                  +₹100
                </span>
              </p>
            ) : (
              <p className="mt-1 rounded-lg border border-dashed border-rule px-2 py-1.5 text-xs text-ink-muted">
                No transactions yet
              </p>
            )}
          </Phone>
        </Row>
      </div>
      <figcaption className="mt-2 text-center font-hand text-xl text-ink-muted">
        {fixed
          ? "Same three screens, but the refresh is only served by a node that already has the write."
          : "The write landed on the primary. The refresh was answered by a replica that hasn't heard about it yet."}
      </figcaption>
    </figure>
  );
}
