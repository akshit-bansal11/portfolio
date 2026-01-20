'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { navConfigs } from '@/config/navConfig';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavBarProps {
    page?: string;
}

export default function NavBar({ page }: NavBarProps) {
    const pathname = usePathname();
    const configKey = page || (pathname === '/' ? 'home' : 'projects');
    const navItems = navConfigs[configKey] || navConfigs['home'];
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Simple intersection observer logic to track active section
    useEffect(() => {
        if (configKey !== 'home') return; // Only for home page with scroll sections

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // 50% visibility
            rootMargin: "-10% 0px -10% 0px"
        });

        navItems.forEach((item) => {
            if (!item.to.startsWith('/')) {
                const element = document.getElementById(item.to);
                if (element) observer.observe(element);
            }
        });

        // Combined scroll handler for both active tab reset and navbar position
        const handleScroll = () => {
             const scrollY = window.scrollY;
            if (scrollY < 100) {
                setActiveTab(null);
                setIsScrolled(false);
            } else {
                setIsScrolled(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        }
    }, [configKey, navItems]);


    const handleScroll = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveTab(id);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {!isScrolled ? (
                /* TOP NAVBAR */
                <motion.div
                    key="top-navbar"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex justify-center p-4 fixed top-0 left-0 right-0 z-50 pointer-events-none"
                >
                    <div className="bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-700/50 p-1.5 shadow-xl pointer-events-auto">
                        <NavigationMenu>
                            <NavigationMenuList className="flex-row space-x-1">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isRoute = item.to && item.to.startsWith('/');
                                    const isActive = activeTab === item.to || (isRoute && pathname === item.to);
                                    const isHovered = hoveredTab === item.to;

                                    return (
                                        <NavigationMenuItem key={index} className="relative">
                                            {isRoute ? (
                                                <Link
                                                    href={item.to}
                                                    className="relative z-20 flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors duration-200 hover:text-white"
                                                    onMouseEnter={() => setHoveredTab(item.to)}
                                                    onMouseLeave={() => setHoveredTab(null)}
                                                    onClick={() => setActiveTab(item.to)}
                                                    data-active={isActive ? "true" : undefined}
                                                >
                                                    <span className="hidden sm:inline">{item.text}</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    className={cn(
                                                        "relative z-20 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none",
                                                        isActive ? "text-white" : "text-neutral-400 hover:text-white"
                                                    )}
                                                    onClick={(e) => handleScroll(e, item.to)}
                                                    onMouseEnter={() => setHoveredTab(item.to)}
                                                    onMouseLeave={() => setHoveredTab(null)}
                                                >
                                                    <span className="hidden sm:inline">{item.text}</span>
                                                </button>
                                            )}

                                            {((isActive && !hoveredTab) || isHovered) && (
                                                <motion.div
                                                    layoutId="nav-box-top"
                                                    className="absolute inset-0 z-10 rounded-full bg-neutral-700/50 border border-neutral-600/50"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </motion.div>
            ) : (
                /* SIDE NAVBAR */
                <motion.div
                    key="side-navbar"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed top-0 right-0 h-full flex flex-col justify-center pr-4 z-50 pointer-events-none"
                >
                    <div className="bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-700/50 p-2 shadow-xl pointer-events-auto flex flex-col items-center">
                        <NavigationMenu>
                            <NavigationMenuList className="flex-col space-y-4">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isRoute = item.to && item.to.startsWith('/');
                                    const isActive = activeTab === item.to || (isRoute && pathname === item.to);
                                    const isHovered = hoveredTab === item.to;

                                    return (
                                        <NavigationMenuItem key={index} className="relative">
                                            {isRoute ? (
                                                <Link
                                                    href={item.to}
                                                    className="relative z-20 flex items-center justify-center p-2 text-sm font-medium text-neutral-400 transition-colors duration-200 hover:text-white"
                                                    onMouseEnter={() => setHoveredTab(item.to)}
                                                    onMouseLeave={() => setHoveredTab(null)}
                                                    onClick={() => setActiveTab(item.to)}
                                                    data-active={isActive ? "true" : undefined}
                                                >
                                                    {Icon && <Icon className="h-5 w-5" />}
                                                </Link>
                                            ) : (
                                                <button
                                                    className={cn(
                                                        "relative z-20 flex items-center justify-center p-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none",
                                                        isActive ? "text-white" : "text-neutral-400 hover:text-white"
                                                    )}
                                                    onClick={(e) => handleScroll(e, item.to)}
                                                    onMouseEnter={() => setHoveredTab(item.to)}
                                                    onMouseLeave={() => setHoveredTab(null)}
                                                >
                                                    {Icon && <Icon className="h-5 w-5" />}
                                                </button>
                                            )}

                                            {((isActive && !hoveredTab) || isHovered) && (
                                                <motion.div
                                                    layoutId="nav-box-side"
                                                    className="absolute inset-0 z-10 rounded-full bg-neutral-700/50 border border-neutral-600/50"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
