/*
 * HeroBackdrop.tsx
 * Decorative backdrop layered behind the hero canvas.
 * Combines an ambient brand gradient, five floating
 * colored ElegantShape spheres, and a soft top/bottom
 * vignette to blend into the next section.
 */

"use client";

import ElegantShape from "./ElegantShape";

// Renders the full hero backdrop layer stack.
export default function HeroBackdrop() {
	return (
		<div className="pointer-events-none absolute inset-0 z-[-1]">
			{/* Ambient brand gradient. */}
			<div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-rose-500/5 blur-3xl" />

			{/* Floating coloured spheres. */}
			<div className="absolute inset-0 overflow-hidden">
				{/* ── Mobile Layout (block md:hidden) ── */}
				<div className="absolute inset-0 block md:hidden">
					<ElegantShape
						delay={0.2}
						width={140}
						height={35}
						rotate={10}
						gradient="from-indigo-500/[0.15]"
						className="left-[-5%] top-[8%]"
					/>
					<ElegantShape
						delay={0.4}
						width={120}
						height={30}
						rotate={-12}
						gradient="from-rose-500/[0.15]"
						className="right-[-8%] top-[13%]"
					/>
					<ElegantShape
						delay={0.3}
						width={100}
						height={25}
						rotate={-6}
						gradient="from-violet-500/[0.15]"
						className="left-[15%] top-[18%]"
					/>
					<ElegantShape
						delay={0.5}
						width={90}
						height={22}
						rotate={18}
						gradient="from-amber-500/[0.15]"
						className="right-[12%] top-[24%]"
					/>
					<ElegantShape
						delay={0.6}
						width={80}
						height={20}
						rotate={-15}
						gradient="from-cyan-500/[0.15]"
						className="left-[5%] top-[29%]"
					/>
					<ElegantShape
						delay={0.7}
						width={110}
						height={28}
						rotate={14}
						gradient="from-indigo-500/[0.15]"
						className="right-[18%] top-[35%]"
					/>
					<ElegantShape
						delay={0.9}
						width={130}
						height={32}
						rotate={-8}
						gradient="from-rose-500/[0.15]"
						className="left-[-10%] top-[41%]"
					/>
					<ElegantShape
						delay={0.8}
						width={120}
						height={30}
						rotate={20}
						gradient="from-violet-500/[0.15]"
						className="right-[-5%] top-[47%]"
					/>
					<ElegantShape
						delay={1.0}
						width={100}
						height={25}
						rotate={-14}
						gradient="from-amber-500/[0.15]"
						className="left-[20%] top-[54%]"
					/>
					<ElegantShape
						delay={1.1}
						width={90}
						height={22}
						rotate={12}
						gradient="from-cyan-500/[0.15]"
						className="right-[8%] top-[61%]"
					/>
					<ElegantShape
						delay={1.2}
						width={120}
						height={30}
						rotate={-10}
						gradient="from-indigo-500/[0.15]"
						className="left-[10%] top-[68%]"
					/>
					<ElegantShape
						delay={1.4}
						width={100}
						height={25}
						rotate={16}
						gradient="from-rose-500/[0.15]"
						className="right-[25%] top-[73%]"
					/>
					<ElegantShape
						delay={1.3}
						width={90}
						height={22}
						rotate={-18}
						gradient="from-violet-500/[0.15]"
						className="left-[-5%] top-[78%]"
					/>
					<ElegantShape
						delay={1.5}
						width={110}
						height={28}
						rotate={8}
						gradient="from-amber-500/[0.15]"
						className="right-[-8%] top-[83%]"
					/>
					<ElegantShape
						delay={1.6}
						width={80}
						height={20}
						rotate={-12}
						gradient="from-cyan-500/[0.15]"
						className="left-[15%] top-[88%]"
					/>
				</div>

				{/* ── Tablet Layout (hidden md:block lg:hidden) ── */}
				<div className="absolute inset-0 hidden md:block lg:hidden">
					<ElegantShape
						delay={0.2}
						width={220}
						height={55}
						rotate={12}
						gradient="from-indigo-500/[0.12]"
						className="left-[-8%] top-[6%]"
					/>
					<ElegantShape
						delay={0.4}
						width={200}
						height={50}
						rotate={-15}
						gradient="from-rose-500/[0.12]"
						className="right-[-5%] top-[11%]"
					/>
					<ElegantShape
						delay={0.3}
						width={160}
						height={40}
						rotate={-8}
						gradient="from-violet-500/[0.12]"
						className="left-[10%] top-[16%]"
					/>
					<ElegantShape
						delay={0.5}
						width={140}
						height={35}
						rotate={20}
						gradient="from-amber-500/[0.12]"
						className="right-[15%] top-[21%]"
					/>
					<ElegantShape
						delay={0.6}
						width={120}
						height={30}
						rotate={-25}
						gradient="from-cyan-500/[0.12]"
						className="left-[5%] top-[27%]"
					/>
					<ElegantShape
						delay={0.7}
						width={180}
						height={45}
						rotate={10}
						gradient="from-indigo-500/[0.12]"
						className="right-[20%] top-[33%]"
					/>
					<ElegantShape
						delay={0.9}
						width={210}
						height={52}
						rotate={-12}
						gradient="from-rose-500/[0.12]"
						className="left-[-6%] top-[39%]"
					/>
					<ElegantShape
						delay={0.8}
						width={190}
						height={48}
						rotate={15}
						gradient="from-violet-500/[0.12]"
						className="right-[-4%] top-[45%]"
					/>
					<ElegantShape
						delay={1.0}
						width={150}
						height={38}
						rotate={-10}
						gradient="from-amber-500/[0.12]"
						className="left-[18%] top-[52%]"
					/>
					<ElegantShape
						delay={1.1}
						width={130}
						height={32}
						rotate={25}
						gradient="from-cyan-500/[0.12]"
						className="right-[12%] top-[60%]"
					/>
					<ElegantShape
						delay={1.2}
						width={170}
						height={42}
						rotate={-18}
						gradient="from-indigo-500/[0.12]"
						className="left-[8%] top-[66%]"
					/>
					<ElegantShape
						delay={1.4}
						width={150}
						height={38}
						rotate={14}
						gradient="from-rose-500/[0.12]"
						className="right-[22%] top-[72%]"
					/>
					<ElegantShape
						delay={1.3}
						width={140}
						height={35}
						rotate={-12}
						gradient="from-violet-500/[0.12]"
						className="left-[-4%] top-[78%]"
					/>
					<ElegantShape
						delay={1.5}
						width={160}
						height={40}
						rotate={8}
						gradient="from-amber-500/[0.12]"
						className="right-[-5%] top-[83%]"
					/>
					<ElegantShape
						delay={1.6}
						width={120}
						height={30}
						rotate={-15}
						gradient="from-cyan-500/[0.12]"
						className="left-[12%] top-[87%]"
					/>
				</div>

				{/* ── Desktop & Wide Screens Layout (hidden lg:block) ── */}
				<div className="absolute inset-0 hidden lg:block">
					<ElegantShape
						delay={0.3}
						width={600}
						height={140}
						rotate={12}
						gradient="from-indigo-500/[0.15]"
						className="left-[-5%] top-[20%]"
					/>
					<ElegantShape
						delay={0.5}
						width={500}
						height={120}
						rotate={-15}
						gradient="from-rose-500/[0.15]"
						className="right-[0%] top-[75%]"
					/>
					<ElegantShape
						delay={0.4}
						width={300}
						height={80}
						rotate={-8}
						gradient="from-violet-500/[0.15]"
						className="left-[10%] bottom-[10%]"
					/>
					<ElegantShape
						delay={0.6}
						width={200}
						height={60}
						rotate={20}
						gradient="from-amber-500/[0.15]"
						className="right-[20%] top-[15%]"
					/>
					<ElegantShape
						delay={0.7}
						width={150}
						height={40}
						rotate={-25}
						gradient="from-cyan-500/[0.15]"
						className="left-[25%] top-[10%]"
					/>
				</div>
			</div>

			{/* Soft vignette so transitions to the next section blend. */}
			<div className="absolute inset-0 bg-linear-to-t from-[#030303] via-transparent to-[#030303]/80" />
		</div>
	);
}
