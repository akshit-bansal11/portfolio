import {
	FaBriefcase,
	FaCertificate,
	FaGraduationCap,
	FaHome,
	FaLaptopCode,
	FaUser,
} from "react-icons/fa";
import { FaShapes } from "react-icons/fa6";
import type { NavItem } from "@/types";

export const navConfigs: Record<string, NavItem[]> = {
	home: [
		{ text: "Profile", to: "profile", icon: FaUser },
		{ text: "Projects", to: "projects", icon: FaLaptopCode },
		{ text: "Experience", to: "experience", icon: FaBriefcase },
		{ text: "Skills", to: "skills", icon: FaShapes },
		{ text: "Attainments", to: "attainments", icon: FaCertificate },
		{ text: "Education", to: "education", icon: FaGraduationCap },
	],
	projects: [{ text: "Home", to: "/", icon: FaHome }],
};
