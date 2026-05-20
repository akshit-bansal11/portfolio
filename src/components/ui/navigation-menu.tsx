/*
 * navigation-menu.tsx
 * Shadcn-style wrappers around Radix's Navigation Menu.
 * Re-exports composable primitives (Root, List, Item,
 * Trigger, Content, Link, Indicator, Viewport) styled
 * to match the project's dark theme.
 */

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Animated viewport that hosts the active menu's content panel.
const NavigationMenuViewport = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<div className={cn("absolute left-0 top-full flex justify-center")}>
		<NavigationMenuPrimitive.Viewport
			className={cn(
				"origin-top-center relative mt-1.5 w-full overflow-hidden rounded-md border bg-neutral-900 text-neutral-100 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
				className,
			)}
			style={{
				height: "var(--radix-navigation-menu-viewport-height)",
				width: "var(--radix-navigation-menu-viewport-width)",
			}}
			ref={ref}
			{...props}
		/>
	</div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

// Top-level navigation root that hosts the list and viewport.
const NavigationMenu = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Root
		ref={ref}
		className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
		{...props}
	>
		{children}
		<div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
			<NavigationMenuViewport />
		</div>
	</NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

// List wrapper for navigation items.
const NavigationMenuList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
		{...props}
	/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

// Re-export the bare item primitive — no extra styling needed.
const NavigationMenuItem = NavigationMenuPrimitive.Item;

// Shared trigger style (used by NavigationMenuTrigger and exported standalone).
const navigationMenuTriggerStyle = cva(
	"group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800 hover:text-neutral-100 focus:bg-neutral-800 focus:text-neutral-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-neutral-800/50 data-[state=open]:bg-neutral-800/50",
);

// Trigger button for a navigation submenu, with rotating chevron.
const NavigationMenuTrigger = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(navigationMenuTriggerStyle(), "group", className)}
		{...props}
	>
		{children}{" "}
		<ChevronDown
			className="relative top-px ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
			aria-hidden="true"
		/>
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

// Content panel that slides in/out for the active trigger.
const NavigationMenuContent = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn(
			"left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

// Re-export the link primitive — used for clickable menu items.
const NavigationMenuLink = NavigationMenuPrimitive.Link;

// Optional caret indicator that follows the active trigger.
const NavigationMenuIndicator = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		className={cn(
			"top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
			className,
		)}
		{...props}
	>
		<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-neutral-800 shadow-md" />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
};
