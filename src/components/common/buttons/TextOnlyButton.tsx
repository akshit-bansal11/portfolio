"use client";
import { motion } from "framer-motion";
import type React from "react";
import { useNavClick } from "@/hooks/use-nav-click";

interface TextOnlyButtonProps {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	to?: string | null;
	className?: string;
	children?: React.ReactNode;
	type?: "button" | "submit" | "reset";
	text?: string;
}

export default function TextOnlyButton({
	onClick,
	to,
	className = "",
	children,
	type = "button",
	text = "Button",
}: TextOnlyButtonProps) {
	const handleClick = useNavClick(to, onClick);
	return (
		<motion.button
			type={type}
			onClick={handleClick}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			className={`
                flex items-center gap-2 cursor-pointer
                text-[8px] md:text-sm lg:text-lg text-nowrap md:text-nowrap lg:text-nowrap
                transition-colors duration-200 ease-in-out
                ${className}
            `}
		>
			{children || text}
		</motion.button>
	);
}
