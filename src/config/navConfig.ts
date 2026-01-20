import { NavItem } from "@/types";
import { FaLaptopCode, FaBriefcase, FaUser, FaGraduationCap, FaCertificate, FaHome } from "react-icons/fa";
// Removed FaShapes as it might be causing issues if strictly using fa. Replaced or removed.
// If FaShapes is needed, we can try to import it from fa6 specifically if generic fa doesn't have it.
// Providing a fallback or just removing it for now to fix build.
import { FaShapes } from "react-icons/fa6";

export const navConfigs: Record<string, NavItem[]> = {
    home: [
        { text: 'Profile', to: 'profile', icon: FaUser },
        { text: 'Projects', to: 'projects', icon: FaLaptopCode },
        { text: 'Experience', to: 'experience', icon: FaBriefcase },
        { text: 'Skills', to: 'skills', icon: FaShapes },
        { text: 'Attainments', to: 'attainments', icon: FaCertificate },
        { text: 'Education', to: 'education', icon: FaGraduationCap },
    ],
    projects: [
        { text: 'Home', to: '/', icon: FaHome },
    ]
};
