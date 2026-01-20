import { FaStar } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface SkillBadgeProps {
  name: string;
  icon: React.ReactNode;
  stars: number;
  source?: string;
  delay?: number;
  link?: string;
}

const SkillBadge = ({
  name,
  icon,
  stars,
  source = "",
  delay = 0,
  link = "",
}: SkillBadgeProps) => {
  const totalStars = 5;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut", delay },
      }}
      whileHover={{ y: -5 }}
      className="block group"
    >
      <div className="relative flex flex-col items-center w-32 md:w-44 aspect-[4/5] rounded-2xl bg-neutral-900/40 border border-neutral-800/50 hover:border-neutral-700/80 transition-all duration-500 overflow-hidden backdrop-blur-sm group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        {/* Animated Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex flex-col items-center justify-center p-5 gap-4 flex-1 w-full relative z-10">
          {/* Icon Container with subtle glass effect */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 group-hover:border-neutral-600 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
            <div className="text-3xl md:text-4xl text-white drop-shadow-md">
              {icon}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 tracking-tight group-hover:text-white transition-colors">
              {name}
            </h3>

            {/* Premium Star Rating */}
            <div className="flex gap-1">
              {[...Array(totalStars)].map((_, idx) => (
                <FaStar
                  key={idx}
                  className={`text-[10px] md:text-xs transition-colors duration-500 ${
                    idx < stars
                      ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                      : "text-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Source Footer */}
        <div className="w-full flex items-center justify-center py-2.5 px-3 bg-neutral-950/40 border-t border-neutral-800/80 group-hover:bg-neutral-900/60 transition-colors">
          <span className="text-[9px] md:text-[11px] text-green-400 font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-green-300">
            {source}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default SkillBadge;
