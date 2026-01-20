import { FaGithub, FaLinkedinIn, FaHackerrank, FaTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { SocialLink } from "@/types";

export const socialLinks: SocialLink[] = [
    {
        Name: "GitHub",
        Icon: FaGithub,
        href: "https://github.com/akshit-bansal11",
        delay: 0,
    },
    {
        Name: "LinkedIn",
        Icon: FaLinkedinIn,
        href: "https://www.linkedin.com/in/akshit-bansal11/",
        delay: 0.1,
    },
    {
        Name: "HackerRank",
        Icon: FaHackerrank,
        href: "http://hackerrank.com/profile/akshitbansal11",
        delay: 0.2,
    },
    {
        Name: "Twitter",
        Icon: FaTwitter,
        href: "https://x.com/akshit_bansal11",
        delay: 0.3,
    },
    {
        Name: "LeetCode",
        Icon: SiLeetcode,
        href: "https://leetcode.com/u/akshit-bansal11/",
        delay: 0.4,
    },
];
