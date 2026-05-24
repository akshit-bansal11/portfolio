"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ClickSound() {
	const [isMuted, setIsMuted] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const audioCtxRef = useRef<AudioContext | null>(null);

	// Load initial muted preference from localStorage on mount.
	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("click-sound-muted");
		if (stored !== null) {
			setIsMuted(stored === "true");
		}
	}, []);

	// Save mute state changes to localStorage.
	const toggleMute = () => {
		const nextState = !isMuted;
		setIsMuted(nextState);
		localStorage.setItem("click-sound-muted", String(nextState));
	};

	// Dynamic audio synthesis function
	const playClickSound = useCallback(() => {
		try {
			if (!audioCtxRef.current) {
				const AudioCtx =
					window.AudioContext ||
					(window as unknown as Window & { webkitAudioContext?: typeof AudioContext })
						.webkitAudioContext;
				if (AudioCtx) {
					audioCtxRef.current = new AudioCtx();
				}
			}

			const ctx = audioCtxRef.current;
			if (!ctx) return;

			if (ctx.state === "suspended") {
				ctx.resume();
			}

			const now = ctx.currentTime;

			// 1. Crisp high-frequency mechanical contact noise burst (4ms)
			const noiseBufferLen = Math.floor(ctx.sampleRate * 0.004);
			const noiseBuffer = ctx.createBuffer(1, noiseBufferLen, ctx.sampleRate);
			const noiseData = noiseBuffer.getChannelData(0);
			for (let i = 0; i < noiseBufferLen; i++) {
				// Quadratic decay for a sharper transient drop
				noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseBufferLen) ** 2;
			}

			const noiseNode = ctx.createBufferSource();
			noiseNode.buffer = noiseBuffer;

			// Highpass filter at 6500Hz for sharp metallic bite
			const noiseFilter = ctx.createBiquadFilter();
			noiseFilter.type = "highpass";
			noiseFilter.frequency.value = 6500;

			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(0.2, now);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.0035);

			noiseNode.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
			noiseNode.start(now);
			noiseNode.stop(now + 0.005);

			// 2. High-pitch transient sweep (sine wave decaying from 4500Hz to 1600Hz in 10ms)
			const osc = ctx.createOscillator();
			const bodyGain = ctx.createGain();

			osc.type = "sine";
			osc.frequency.setValueAtTime(4500, now);
			osc.frequency.exponentialRampToValueAtTime(1600, now + 0.01);

			bodyGain.gain.setValueAtTime(0.18, now);
			bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);

			osc.connect(bodyGain).connect(ctx.destination);
			osc.start(now);
			osc.stop(now + 0.012);
		} catch {
			// Ignore any web audio context errors
		}
	}, []);

	// Register global event listener for all mouse clicks.
	useEffect(() => {
		if (isMuted) return;

		const handleGlobalClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target) return;

			// Skip if clicking our toggle button or any element marked to skip click sound
			if (target.closest("#sound-toggle-btn") || target.closest("[data-no-click-sound]")) {
				return;
			}
			playClickSound();
		};

		window.addEventListener("click", handleGlobalClick, { capture: true });
		return () => {
			window.removeEventListener("click", handleGlobalClick, { capture: true });
		};
	}, [isMuted, playClickSound]);

	if (!mounted) return null;

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
			{/* Tooltip */}
			<AnimatePresence>
				{showTooltip && (
					<motion.div
						initial={{ opacity: 0, y: 6, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 6, scale: 0.95 }}
						transition={{ duration: 0.12, ease: "easeOut" }}
						className="absolute bottom-full mb-2 pointer-events-none"
					>
						<div className="px-2.5 py-1 bg-neutral-900/90 border border-neutral-700/60 shadow-xl rounded-md text-[10px] uppercase tracking-wider font-semibold text-white whitespace-nowrap backdrop-blur-sm">
							{isMuted ? "Unmute click sounds" : "Mute click sounds"}
						</div>
						{/* Small arrow pointing down */}
						<div className="flex justify-center -mt-px">
							<div className="w-1.5 h-1.5 bg-neutral-900/90 border-r border-b border-neutral-700/60 rotate-45 -translate-y-px" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Toggle Button */}
			<motion.button
				id="sound-toggle-btn"
				type="button"
				onClick={toggleMute}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-md cursor-pointer ${
					isMuted
						? "bg-neutral-900/40 text-neutral-500 border-neutral-800/80 hover:text-neutral-300 hover:border-neutral-700"
						: "bg-neutral-900/80 text-white border-neutral-700/50 hover:bg-neutral-800 shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_20px_rgba(255,255,255,0.18)]"
				}`}
				aria-label={isMuted ? "Unmute click sounds" : "Mute click sounds"}
			>
				{isMuted ? (
					<VolumeX className="h-4.5 w-4.5 transition-transform duration-200" />
				) : (
					<Volume2 className="h-4.5 w-4.5 transition-transform duration-200" />
				)}
			</motion.button>
		</div>
	);
}
