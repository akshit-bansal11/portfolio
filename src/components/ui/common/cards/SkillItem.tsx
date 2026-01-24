import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SkillItemProps {
  Icon: string | React.ElementType;
  name: string;
  disableHover?: boolean;
}

const SkillItem = ({ Icon, name, disableHover = false }: SkillItemProps) => {
  const isStringIcon = typeof Icon === "string";

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 select-none overflow-hidden transition-all duration-300",
        !disableHover && "group hover:border-neutral-500/30 cursor-default"
      )}
      whileHover={!disableHover ? { y: -8, scale: 1.05 } : undefined}
    >
      {/* Background Glow Effect */}
      {!disableHover && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div
        className={cn(
          "relative z-10 flex items-center justify-center transition-transform duration-500",
          !disableHover && "group-hover:scale-110"
        )}
      >
        {isStringIcon ? (
          <Image
            src={Icon}
            alt={name}
            width={64}
            height={64}
            className={cn(
              "h-12 w-12 md:h-16 md:w-16 object-contain transition-all duration-500",
              !disableHover
                ? "filter grayscale group-hover:grayscale-0"
                : "filter-none"
            )}
          />
        ) : (
          <Icon
            className={cn(
              "h-12 w-12 md:h-16 md:w-16 transition-all duration-500",
              !disableHover
                ? "text-neutral-500 group-hover:text-inherit"
                : "text-neutral-200"
            )}
          />
        )}
      </div>

      <span
        className={cn(
          "relative z-10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500",
          !disableHover ? "text-neutral-500 group-hover:text-white" : "text-neutral-200"
        )}
      >
        {name}
      </span>

      {/* Bottom Accent Line */}
      {!disableHover && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      )}
    </motion.div>
  );
};

export default SkillItem;
