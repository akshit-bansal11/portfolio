/*
 * button.tsx
 * Shadcn-style Button primitive with anime.js scaling.
 * Adds a subtle elastic scale on mouse enter/leave on
 * top of the standard variant + size class system.
 */

"use client";

import { Slot } from "@radix-ui/react-slot";
import { animate } from "animejs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

// Variant definition for the button component.
const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
	{
		variants: {
			variant: {
				default:
					"bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
				destructive:
					"bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
				outline:
					"border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
				secondary:
					"bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
				ghost:
					"hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
				link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

// Public props: standard button attrs + variant/size + asChild slot toggle.
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null
		| undefined;
	size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

// Forwarded-ref Button. Wraps a native <button> or a slotted child.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		// Pick the underlying tag: Slot when asChild, plain button otherwise.
		const Comp = asChild ? Slot : "button";

		// Elastic grow on hover.
		const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
			animate(e.currentTarget, {
				scale: 1.05,
				duration: 800,
				easing: "easeOutElastic(1, .5)",
			});
			props.onMouseEnter?.(e);
		};

		// Smooth restore on hover-out.
		const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
			animate(e.currentTarget, {
				scale: 1,
				duration: 600,
				easing: "easeOutExpo",
			});
			props.onMouseLeave?.(e);
		};

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
