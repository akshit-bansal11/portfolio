/*
 * JumpToPanel.tsx
 * Hero stage-4 "Jump to" panel — 3D cylinder / drum picker (iOS-style).
 *
 * Layout  : Fixed-height viewport; items rotate around a virtual cylinder.
 *            The centre item is at full scale/opacity. Items farther from the
 *            centre are progressively scaled down, blurred, and faded — giving
 *            the illusion of wrapping around a drum.
 * Input   : Mouse-wheel on the container cycles through items (with cooldown).
 *            Clicking any visible item both selects it and smooth-scrolls the
 *            page to the corresponding section.
 * Sound   : Each step plays a short mechanical-tick SFX via Web Audio API
 *            (no asset file needed).
 * Active  : The centre slot gets a coloured highlight ring + glow.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JUMP_TO_CARDS } from "@/data/jumpToCards";

// ─── Public props ────────────────────────────────────────────────────────────
type JumpToPanelProps = object;

// ─── Colour tokens (one per card) ────────────────────────────────────────────
const PILL_COLORS: { border: string; glow: string; text: string }[] = [
	{ border: "rgba(99,102,241,0.65)", glow: "rgba(99,102,241,0.28)", text: "#a5b4fc" }, // indigo
	{ border: "rgba(244,63,94,0.65)", glow: "rgba(244,63,94,0.28)", text: "#fda4af" }, // rose
	{ border: "rgba(245,158,11,0.65)", glow: "rgba(245,158,11,0.28)", text: "#fcd34d" }, // amber
	{ border: "rgba(16,185,129,0.65)", glow: "rgba(16,185,129,0.28)", text: "#6ee7b7" }, // emerald
	{ border: "rgba(139,92,246,0.65)", glow: "rgba(139,92,246,0.28)", text: "#c4b5fd" }, // violet
	{ border: "rgba(6,182,212,0.65)", glow: "rgba(6,182,212,0.28)", text: "#67e8f9" }, // cyan
	{ border: "rgba(236,72,153,0.65)", glow: "rgba(236,72,153,0.28)", text: "#f9a8d4" }, // pink
];

// ─── Cylinder geometry ────────────────────────────────────────────────────────
// How many degrees each "slot" spans on the drum.
const ITEM_ANGLE = 22; // degrees between successive items
// Height of each rendered item slot in pixels.
const ITEM_H = 64; // px — matches the actual rendered row height
// Perspective distance for the 3D scene.
const PERSPECTIVE = 340; // px

// ─── Web-Audio tick SFX ──────────────────────────────────────────────────────
function playTick(ctx: AudioContext) {
	// White-noise burst shaped like a mechanical click (~25 ms).
	const bufLen = Math.floor(ctx.sampleRate * 0.025);
	const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
	const data = buf.getChannelData(0);
	for (let i = 0; i < bufLen; i++) {
		data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen) ** 3;
	}
	const src = ctx.createBufferSource();
	src.buffer = buf;

	// Bandpass centred around 3 kHz for that crisp "tick" character.
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.frequency.value = 3000;
	bp.Q.value = 1.4;

	// Gain envelope: brief attack then silence.
	const gain = ctx.createGain();
	const t = ctx.currentTime;
	gain.gain.setValueAtTime(0.18, t);
	gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

	src.connect(bp).connect(gain).connect(ctx.destination);
	src.start(t);
	src.stop(t + 0.04);
}

// ─── Pill labels ─────────────────────────────────────────────────────────────
const PILL_LABELS = JUMP_TO_CARDS.map((c) => ({
	sectionId: c.sectionId,
	name: c.label,
	hint: c.description,
}));
const total = PILL_LABELS.length;

// ─── Smooth-scroll utility ───────────────────────────────────────────────────
function scrollToSection(id: string) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Visual weight helpers ────────────────────────────────────────────────────
function getItemStyle(distance: number): React.CSSProperties {
	const absD = Math.abs(distance);

	// Scale: centre = 1, each step away shrinks further.
	const scale = absD === 0 ? 1 : absD === 1 ? 0.83 : absD === 2 ? 0.65 : 0.5;
	// Opacity: centre full, progressively fades.
	const opacity = absD === 0 ? 1 : absD === 1 ? 0.62 : absD === 2 ? 0.32 : 0.12;
	// Blur: centre none, increasing with distance.
	const blur = absD === 0 ? 0 : absD === 1 ? 0.4 : absD === 2 ? 1 : 1.8;

	// rotateX: each slot lives at distance*ITEM_ANGLE on the cylinder.
	const rotateX = distance * ITEM_ANGLE;
	// Translate in Y so items arc away from the viewer (depth illusion).
	// The cylinder radius r = ITEM_H / (2 * tan(θ/2)); we approximate with a
	// simple cos-based translateZ to give a curved-surface feel.
	const rad = (rotateX * Math.PI) / 180;
	const translateZ = Math.cos(rad) * 18 - 18; // 0 at centre, negative at edges

	return {
		position: "absolute" as const,
		left: 0,
		right: 0,
		top: "50%",
		transform: `translateY(-50%) translateY(${distance * ITEM_H}px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scale})`,
		opacity,
		filter: blur > 0 ? `blur(${blur}px)` : "none",
		transition: "transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.32s ease, filter 0.32s ease",
		zIndex: 10 - absD,
		pointerEvents: absD <= 2 ? "auto" : "none",
		willChange: "transform, opacity, filter",
	};
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function JumpToPanel(_props: JumpToPanelProps) {
	// Active index.
	const [active, setActive] = useState(0);

	// AudioContext — created lazily on first interaction.
	const audioCtxRef = useRef<AudioContext | null>(null);
	const getCtx = useCallback(() => {
		if (!audioCtxRef.current) {
			audioCtxRef.current = new AudioContext();
		}
		return audioCtxRef.current;
	}, []);

	// Navigate to a pill (with wrap-around) and play tick.
	const goTo = useCallback(
		(next: number) => {
			const idx = ((next % total) + total) % total;
			setActive(idx);
			try {
				playTick(getCtx());
			} catch {
				/* ignore */
			}
		},
		[getCtx],
	);

	// Mouse-wheel handler: deltaY > 0 → next, < 0 → prev.
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		let cooldown = false;
		const handler = (e: WheelEvent) => {
			e.preventDefault();
			if (cooldown) return;
			cooldown = true;
			setTimeout(() => {
				cooldown = false;
			}, 200);
			setActive((prev) => {
				const next = (((prev + (e.deltaY > 0 ? 1 : -1)) % total) + total) % total;
				try {
					playTick(getCtx());
				} catch {
					/* ignore */
				}
				return next;
			});
		};
		el.addEventListener("wheel", handler, { passive: false });
		return () => el.removeEventListener("wheel", handler);
	}, [getCtx]);

	// How many items to render on either side of centre (visible on drum).
	const visibleRadius = 1;

	return (
		<div className="pointer-events-auto">
			<div
				ref={containerRef}
				className="flex flex-col gap-3"
				style={{ width: "clamp(200px, 28vw, 320px)" }}
			>
				{/* ── Label ──────────────────────────────────────────── */}
				<p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-500 select-none">
					Jump to
				</p>

				{/* ── Drum + dot column ─────────────────────────────── */}
				<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
					{/* 3D Drum viewport */}
					<div
						style={{
							flex: 1,
							position: "relative",
							height: ITEM_H * (visibleRadius * 2 + 1),
							// perspective here creates the 3-D depth field
							perspective: PERSPECTIVE,
							perspectiveOrigin: "50% 50%",
							overflow: "hidden",
						}}
					>
						{/* Shading overlays — top & bottom fade to reinforce the curve */}
						<div
							aria-hidden
							style={{
								position: "absolute",
								inset: 0,
								zIndex: 20,
								pointerEvents: "none",
								background: [
									"linear-gradient(to bottom,",
									"  rgba(3,3,3,0.95) 0%,",
									"  rgba(3,3,3,0.4) 22%,",
									"  transparent 38%,",
									"  transparent 62%,",
									"  rgba(3,3,3,0.4) 78%,",
									"  rgba(3,3,3,0.95) 100%",
									")",
								].join(" "),
							}}
						/>

						{/* Centre highlight ring */}
						<div
							aria-hidden
							style={{
								position: "absolute",
								left: 10,
								right: 10,
								top: "50%",
								transform: "translateY(-50%)",
								height: ITEM_H,
								borderRadius: 12,
								border: `1.5px solid ${PILL_COLORS[active % PILL_COLORS.length].border}`,
								boxShadow: `0 0 22px 4px ${PILL_COLORS[active % PILL_COLORS.length].glow}`,
								zIndex: 15,
								pointerEvents: "none",
								transition: "border-color 0.28s ease, box-shadow 0.28s ease",
							}}
						/>

						{/* Items — rendered for a window around active */}
						{(() => {
							const items = [];
							for (let d = -visibleRadius - 1; d <= visibleRadius + 1; d++) {
								const idx = (((active + d) % total) + total) % total;
								const pill = PILL_LABELS[idx];
								const color = PILL_COLORS[idx % PILL_COLORS.length];
								const isCenter = d === 0;

								items.push(
									<button
										type="button"
										key={`${d}-${idx}`}
										data-no-click-sound
										style={{
											...getItemStyle(d),
											background: "none",
											border: "none",
											padding: 0,
											textAlign: "left",
											width: "100%",
											cursor: "pointer",
										}}
										onClick={() => {
											if (isCenter) {
												scrollToSection(pill.sectionId);
											} else {
												goTo(active + d);
												scrollToSection(pill.sectionId);
											}
										}}
									>
										<div
											style={{
												marginLeft: 10,
												marginRight: 10,
												padding: "10px 14px",
												borderRadius: 10,
												cursor: "pointer",
												userSelect: "none",
												background: isCenter
													? `radial-gradient(ellipse at 50% 0%, ${color.glow} 0%, rgba(8,8,12,0.0) 75%)`
													: "transparent",
											}}
										>
											<div
												style={{
													fontSize: 14,
													fontWeight: 600,
													letterSpacing: "0.01em",
													color: isCenter ? color.text : "rgba(255,255,255,0.8)",
													lineHeight: 1.2,
													transition: "color 0.28s ease",
												}}
											>
												{pill.name}
											</div>
											<div
												style={{
													fontSize: 11,
													color: isCenter ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.28)",
													lineHeight: 1.35,
													marginTop: 3,
													transition: "color 0.28s ease",
												}}
											>
												{pill.hint}
											</div>
										</div>
									</button>,
								);
							}
							return items;
						})()}
					</div>

					{/* Vertical dot column */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 5,
						}}
					>
						{PILL_LABELS.map((_, i) => {
							const color = PILL_COLORS[i % PILL_COLORS.length];
							const isActive = i === active;
							return (
								<button
									type="button"
									key={i}
									onClick={() => goTo(i)}
									data-no-click-sound
									style={{
										width: 5,
										height: isActive ? 16 : 5,
										borderRadius: 99,
										background: isActive ? color.border : "rgba(255,255,255,0.13)",
										transition: "height 0.28s cubic-bezier(.4,0,.2,1), background 0.28s ease",
										border: "none",
										cursor: "pointer",
										padding: 0,
										flexShrink: 0,
									}}
									aria-label={`Go to ${PILL_LABELS[i].name}`}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
