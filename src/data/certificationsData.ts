import { SiCplusplus, SiCoursera } from "react-icons/si";
import ceisd from '@/assets/images/certificates/ceisd.webp';
import ceiga from '@/assets/images/certificates/ceiga.webp';
import sqlbhack from '@/assets/images/certificates/sqlbhack.webp';
import jsbhack from '@/assets/images/certificates/jsbhack.webp';
import cssbhack from '@/assets/images/certificates/cssbhack.webp';
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
        certificate: ceisd,
        link: "https://www.linkedin.com/learning/certificates/b49081d79547f863f12dd8656302ede27f342d628631d481085b14b727dcc910?trk=share_certificate"
    },
    {
        certificate: ceiga,
        link: "https://www.linkedin.com/learning/certificates/b0d6803487e5b12b7ddf935a52b4efa6541460fcae5faacb7e7354ec96f78832?trk=share_certificate"
    },
    {
        certificate: sqlbhack,
        link: "https://www.hackerrank.com/certificates/7f1a01b7b859"
    },
    {
        certificate: jsbhack,
        link: "https://www.hackerrank.com/certificates/9eabe8ab61b1"
    },
    {
        certificate: cssbhack,
        link: "https://www.hackerrank.com/certificates/35384d086309"
    }
];
