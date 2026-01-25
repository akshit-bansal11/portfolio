import { SiCplusplus, SiCoursera } from "react-icons/si";
import { AchievementItem, CertificationItem } from "@/types";

export const achievements: AchievementItem[] = [
    {
        name: "C++",
        icon: SiCplusplus,
        stars: 5,
        source: "HackerRank",
        delay: 0.2,
        link: "https://www.hackerrank.com/profile/akshitbansal11"
    },
    {
        name: "C",
        icon: SiCoursera, // Note: Using SiCoursera as placeholder for C icon requested in original file? Or is C icon SiCoursera? Original file used SiCoursera for "C".
        stars: 2,
        source: "HackerRank",
        delay: 0,
        link: "https://www.hackerrank.com/profile/akshitbansal11"
    }
];

export const certifications: CertificationItem[] = [
    {
        name: "CSS (Basic)",
        GDriveID: "1ud6alNDvAmYybdnIqrnyJQ8IWTWNZ5Ge",
        link: "https://www.hackerrank.com/certificates/35384d086309"
    },
    {
        name: "JavaScript (Basic)",
        GDriveID: "1tB7IPlkqKTV9S1dqLbDddi_OxdqqZ1Gi",
        link: "https://www.hackerrank.com/certificates/7f1a01b7b859"
    },
    {
        name: "Node.js (Basic)",
        GDriveID: "1WiTCtljWgOWgeOH-r4Y3GHpJ6iHEAOQa",
        link: "https://www.hackerrank.com/certificates/9eabe8ab61b1"
    },
    {
        name: "React.js (Basic)",
        GDriveID: "1xT_VVyVuYXa9EnDbfMaZMr4BcBoi1arV",
        link: "https://www.hackerrank.com/certificates/9eabe8ab61b1"
    },
    {
        name: "SQL (Basic)",
        GDriveID: "1gFYPjYV4x6CidehZ2SkF1IdABiubsLls",
        link: "https://www.hackerrank.com/certificates/9eabe8ab61b1"
    },
    {
        name: "Frontend Developer (React)",
        GDriveID: "1cMUhFRucVh1rfGw0pjKNiTk4J9G4Mxfd",
        link: "https://www.hackerrank.com/certificates/9eabe8ab61b1"
    },
];
