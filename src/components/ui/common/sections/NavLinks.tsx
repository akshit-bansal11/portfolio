// Dependencies
import React from 'react';
import { motion } from 'framer-motion';

// Components
import TextOnlyButton from '../buttons/TextOnlyButton';

interface LinkItem {
    text?: string;
    to?: string | null;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: React.ReactNode;
    className?: string;
}

interface NavLinksProps {
    links?: LinkItem[];
    className?: string;
}

// NavLinks Component
// A reusable list of navigation buttons with customizable layout and animation
export default function NavLinks({
    links = [],
    className = '',
}: NavLinksProps) {
    // Render
    return (
        <motion.ul
            className={`flex w-full justify-center items-center flex-nowrap lg:gap-x-8 gap-x-4 md:gap-x-6 ${className}`}
            initial={{ opacity: 0 }} // Initial opacity for animation
            animate={{ opacity: 1 }} // Final opacity for animation
            transition={{ duration: 0.3 }} // Animation duration
        >
            {links.map(({ text, to, onClick, icon, className: buttonClassName }, index) => (
                <li key={index}>
                    <TextOnlyButton
                        text={text}
                        to={to}
                        onClick={onClick}
                        className={`
                            text-white lg:text-neutral-300 lg:hover:text-amber-400
                            hover:drop-shadow-[0_0_5px_rgba(251,191,36,1)]
                            ${buttonClassName}
                        `} // Button-specific CSS classes
                    />
                </li>
            ))}
        </motion.ul>
    );
}
