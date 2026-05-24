"use client";

import React from "react";

export default function ScrollingRibbon() {
	const items = ["FRONTEND", "BACKEND", "UI/UX", "DESIGN", "UNIT TESTING", "DBM"];

	return (
		<div className="relative w-full overflow-visible py-1 flex flex-col items-center">
			{/* Ribbon Track Container - Styled as a Pill */}
			<div
				className="relative w-full rounded-full border border-white/[0.08] bg-black/60 backdrop-blur-md overflow-hidden py-2.5 px-4 flex group shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300"
				style={
					{
						// inject the duration as custom css property
						["--marquee-duration" as string]: "20s",
						WebkitMaskImage:
							"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
						maskImage:
							"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
					} as React.CSSProperties
				}
			>
				{/* Glowing background accent behind the ribbon */}
				<div className="absolute inset-0 opacity-10 blur-2xl -z-10 bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400" />

				{/* 1st Loop Container */}
				<div className="flex flex-row shrink-0 gap-4 min-w-full items-center select-none animate-marquee group-hover:[animation-play-state:paused]">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={`loop1-${i}`}
							className="flex items-center gap-4 font-extrabold tracking-widest uppercase whitespace-nowrap text-xs md:text-sm font-sans"
						>
							{items.map((item, idx) => (
								<React.Fragment key={idx}>
									<span className="bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
										{item}
									</span>
									<span className="text-neutral-400/80 font-black drop-shadow-none select-none text-base md:text-lg">
										•
									</span>
								</React.Fragment>
							))}
						</div>
					))}
				</div>

				{/* 2nd Loop Container (Identical mirror) */}
				<div
					className="flex flex-row shrink-0 gap-4 min-w-full items-center select-none animate-marquee group-hover:[animation-play-state:paused]"
					aria-hidden="true"
				>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={`loop2-${i}`}
							className="flex items-center gap-4 font-extrabold tracking-widest uppercase whitespace-nowrap text-xs md:text-sm font-sans"
						>
							{items.map((item, idx) => (
								<React.Fragment key={idx}>
									<span className="bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
										{item}
									</span>
									<span className="text-neutral-400/80 font-black drop-shadow-none select-none text-base md:text-lg">
										•
									</span>
								</React.Fragment>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
