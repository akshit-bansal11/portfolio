'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    to?: string | null;
    className?: string;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    text?: string;
}

export default function PrimaryButton({
    onClick,
    to,
    className = '',
    children,
    type = 'button',
    icon,
    text = 'Button',
}: PrimaryButtonProps) {
    const router = useRouter();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) onClick(e);
        if (to) {
            if (!to.startsWith('/')) {
                const section = document.getElementById(to);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            } else router.push(to);
        }
    };
    return (
        <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.7 }}
            className='bg-white/10 p-1 rounded-lg'
        >
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
};
