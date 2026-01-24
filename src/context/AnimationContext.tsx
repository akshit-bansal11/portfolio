"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnimationContextType {
    isWelcomeComplete: boolean;
    setWelcomeComplete: (completed: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
    const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);

    return (
        <AnimationContext.Provider value={{ isWelcomeComplete, setWelcomeComplete: setIsWelcomeComplete }}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error("useAnimation must be used within an AnimationProvider");
    }
    return context;
};
