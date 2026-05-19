"use client";

/**
 * Decorative backdrop for the scroll hero. Composes the same five
 * coloured shapes used by the original `HeroGeometric` plus the soft
 * indigo/rose ambient gradient and top/bottom vignette.
 *
 * Kept stateless so it can be dropped into any pinned canvas.
 */

import ElegantShape from "./ElegantShape";

export default function HeroBackdrop() {
	return (
		<>
			{/* Ambient brand gradient. */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-rose-500/5 blur-3xl" />

			{/* Floating coloured spheres. */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<ElegantShape
					delay={0.3}
					width={600}
					height={140}
					rotate={12}
					gradient="from-indigo-500/[0.15]"
					className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
				/>
				<ElegantShape
					delay={0.5}
					width={500}
					height={120}
					rotate={-15}
					gradient="from-rose-500/[0.15]"
					className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
				/>
				<ElegantShape
					delay={0.4}
					width={300}
					height={80}
					rotate={-8}
					gradient="from-violet-500/[0.15]"
					className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
				/>
				<ElegantShape
					delay={0.6}
					width={200}
					height={60}
					rotate={20}
					gradient="from-amber-500/[0.15]"
					className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
				/>
				<ElegantShape
					delay={0.7}
					width={150}
					height={40}
					rotate={-25}
					gradient="from-cyan-500/[0.15]"
					className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
				/>
			</div>

			{/* Soft vignette so transitions to the next section blend. */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#030303] via-transparent to-[#030303]/80" />
		</>
	);
}
