import { useRouter } from "next/navigation";
import type React from "react";

export function useNavClick(
	to?: string | null,
	externalOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
) {
	const router = useRouter();

	return (e: React.MouseEvent<HTMLButtonElement>) => {
		externalOnClick?.(e);
		if (!to) return;
		if (!to.startsWith("/")) {
			document.getElementById(to)?.scrollIntoView({ behavior: "smooth" });
		} else {
			router.push(to);
		}
	};
}
