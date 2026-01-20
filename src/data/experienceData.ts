import { ExperienceItem } from "@/types";

export interface ExperienceCategory {
    title: string;
    items: ExperienceItem[];
}

export const experience: ExperienceCategory[] = [
    {
        title: "Internship",
        items: [
            {
                location: "On-Site",
                company: "Trupeer",
                role: "Full Stack (Next.js/GoLang) Intern",
                date: "Jan 2026 - Ongoing",
                points: [
                    "Just Started - Learning and Working with next.js and GoLang"
                ]
            },
            {
                location: "Remote",
                company: "Bluestock Fintech",
                role: "Software Development Engineer Intern",
                date: "Oct 2024 - Nov 2024",
                points: [
                    "Developed an IPO Dashboard, a full-stack web application for tracking IPOs.",
                    "Implemented real-time IPO listings, user portfolio management, and financial analytics.",
                    "Used Node.js, Express.js, MySQL, and frontend frameworks for seamless user experience",
                ]
            }
        ]
    },
    {
        title: "Training",
        items: [
            {
                location: "Punjab, India",
                company: "Bangalore Computer Education",
                role: "MERN Stack Development + AI Integration Training",
                date: "June 2025 - Aug 2025",
                points: [
                    "MongoDB, Express.js, React.js, Node.js, Gemini API, Redux Toolkit, and Tailwind CSS.",
                    "Developed a full-stack web application with AI integration for enhanced user experience.",
                    "Focused on building scalable, maintainable, and efficient web applications.",
                ],
                certificate: "https://drive.google.com/file/d/1rY3FJ0Zfqx1hOdFl-vjG_Pl1Wp1BqcG8/view?usp=sharing"
            },
            {
                location: "Punjab, India",
                company: "Bangalore Computer Education",
                role: "Data Structures and Algorithms Training",
                date: "Dec 2024 - Mar 2025",
                points: [
                    "In-depth training in data structures and algorithms, focusing on problem-solving skills.",
                    "Covered topics such as arrays, linked lists, trees, graphs, sorting algorithms, and dynamic programming.",
                    "Emphasized practical applications and coding challenges to enhance algorithmic thinking.",
                ],
                certificate: "https://drive.google.com/file/d/1mfCPu-_HIxtpQ9BmfRtOwTAolsryGTap/view?usp=sharing"
            },
            {
                location: "Punjab, India",
                company: "Bangalore Computer Education",
                role: "NodeJS Full Stack Development Training",
                date: "June 2024 - July 2024",
                points: [
                    "Comprehensive training in Node.js for full-stack development.",
                    "Learned to build RESTful APIs, manage databases, and create dynamic web applications.",
                    "Focused on best practices in backend development, including security and performance optimization.",
                ],
                certificate: "https://drive.google.com/file/d/1B-axWT0ka9cSEM2wT0wOrLmXubBDln5a/view?usp=sharing"
            }
        ]
    }
];
