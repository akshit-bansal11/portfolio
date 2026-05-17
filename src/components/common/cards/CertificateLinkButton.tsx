import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CertificateLinkButtonProps {
	href: string;
	className?: string;
}

export default function CertificateLinkButton({ href, className }: CertificateLinkButtonProps) {
	return (
		<div className={className}>
			<Button
				asChild
				variant="outline"
				size="sm"
				className={cn(
					"w-full md:w-auto group/btn gap-2 rounded-full pl-4 pr-3",
					"bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-500",
					"transition-all duration-300",
				)}
			>
				<a href={href} target="_blank" rel="noopener noreferrer">
					<span className="text-xs font-semibold tracking-wide uppercase">View Certificate</span>
					<GoArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
				</a>
			</Button>
		</div>
	);
}
