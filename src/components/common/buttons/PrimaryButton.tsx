/*
 * PrimaryButton.tsx
 * Branded primary CTA button with hover-scale,
 * gradient text-fill on hover, and integrated
 * navigation handling via the useNavClick hook.
 */

"use client";
import { motion } from "framer-motion";
import type React from "react";
import { useNavClick } from "@/hooks/use-nav-click";

// Public props for the button.
interface PrimaryButtonProps {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	to?: string | null;
	className?: string;
	children?: React.ReactNode;
	type?: "button" | "submit" | "reset";
	icon?: React.ReactNode;
	text?: string;
}

// Renders the animated primary button.
export default function PrimaryButton({
	onClick,
	to,
	className = "",
	children,
	type = "button",
	icon,
	text = "Button",
}: PrimaryButtonProps) {
	// Resolves either a section scroll or route push when clicked.
	const handleClick = useNavClick(to, onClick);
	return (
		// Outer container handles the hover/tap scale.
		<motion.div
			initial={{ scale: 1 }}
			whileHover={{ scale: 1.2 }}
			whileTap={{ scale: 0.7 }}
			className="bg-white/10 p-1 rounded-lg"
		>
			{/* Inner button with the gradient text-fill on hover. */}
			<motion.button
				type={type}
				onClick={handleClick}
				className={`
                    flex items-center justify-center gap-2 cursor-pointer rounded-xl px-2 py-[2px]
                    bg-white
                    hover:bg-gradient-to-br hover:from-amber-400 hover:via-orange-500 hover:to-pink-500
                    bg-clip-text text-transparent
                    lg:text-lg md:text-sm text-[8px] font-semibold
                    transition-colors duration-200 
                    ${className}
                `}
			>
				{icon && <span className="text-xs">{icon}</span>}
				{children || text}
			</motion.button>
		</motion.div>
	);
}
