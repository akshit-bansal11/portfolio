import React from "react";

interface ScrollSectionProps {
    id?: string;
    children?: React.ReactNode;
    className?: string;
}

function ScrollSection({ id = '', children = null, className = '' }: ScrollSectionProps) {
    return (
        <section
            id={id}
            className={`
                flex w-full flex-col lg:gap-6 md:gap-4 gap-2 lg:p-5 p-3
                ${className}
            `}
        >
            {children}
        </section>
    );
}

export default ScrollSection;
