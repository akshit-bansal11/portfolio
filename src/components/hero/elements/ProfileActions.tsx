/*
 * ProfileActions.tsx
 * One row: the resume button and the social stickers, vertically centred to each other
 * (the button is as tall as a sticker tile). Wraps on narrow columns.
 */

import { heroSocialLinks } from "@/data/heroSocialLinks";
import { cn } from "@/lib/utils";
import ResumeButton from "./ResumeButton";
import SocialIcon from "./SocialIcon";

interface ProfileActionsProps {
  className?: string;
}

// Renders the resume + socials row.
export default function ProfileActions({ className }: ProfileActionsProps) {
  return (
    <div className={cn("pointer-events-auto flex flex-wrap items-center gap-3", className)}>
      <ResumeButton />
      <div className="flex items-center gap-2">
        {heroSocialLinks.map((link, index) => (
          <SocialIcon key={link.href} {...link} index={index} />
        ))}
      </div>
    </div>
  );
}
