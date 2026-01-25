import { DetailedProjectItem } from '@/types';


export const allProjects: Record<string, DetailedProjectItem[]> = {
    websites: [

        {
            type: 'large',
            title: 'Canopy',
            description: 'Canopy is an open-source bookmarking tool built for the way the web actually feels—messy, fast, and full of ideas. Save links, organize them with flexible tags, and find anything instantly. No folders to fight, no lock-in, no noise. Your bookmarks live under one canopy: structured, searchable, and completely yours.',
            GDriveID: "1BEYDeT_zqMQkLH2E7rC3uqYIAd0_cfyF",
            techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Firebase'],
            demoLink: 'https://use-canopy.vercel.app/',
            githubLink: 'https://github.com/akshit-bansal11/canopy'
        },
        {
            type: 'large',
            title: 'Color Space',
            description: "Color Space is a comprehensive, all-in-one web application designed for designers and developers. It provides a full suite of tools to create, browse, extract, and convert colors and gradients, all in one centralized hub.",
            GDriveID: "1EWjLgw3THDGTxerk3MCOcT4URsb1E5vn",
            techStack: ['React', 'Tailwind', 'Gemini API'],
            demoLink: "https://color-space11.vercel.app/",
            githubLink: "https://github.com/akshit-bansal11/color-space"
        },
        {
            type: 'large',
            title: 'Medishare',
            description: 'MediShare is a donation-based platform that connects medicine donors with people in need through a secure and verified system.',
            GDriveID: "1GlKKrrpe6OmzTt-zs9u-llJK6qWUjuuC",
            techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Gemini API']
        },
        {
            type: 'large',
            title: 'Influera',
            description: 'Influera is a platform that connects influencers with brands for collaborations.',
            GDriveID: "1Y6T0_ui76QlbfO6emonj9_sVzMuzuBdB",
            techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Gemini API'],
            demoLink: "https://influera.onrender.com/",
            githubLink: "https://github.com/akshit-bansal11/influera"
        },
    ],
    games: [
        {
            type: 'small',
            title: 'Rock, Paper, Scissors',
            description: 'A simple rock, paper, scissors game built with HTML, CSS & JavaScript. Play against the computer and try to win!',
            GDriveID: "1CrYa0y4R1bd5a8AJ4fh7K7zIIRWws1Nz",
            techStack: ['HTML', 'CSS', 'JavaScript'],
            demoLink: 'https://akshit-bansal11.github.io/rock-paper-scissors/',
            githubLink: 'https://github.com/akshit-bansal11/rock-paper-scissors'
        },
        {
            type: 'small',
            title: 'Drum Kit',
            description: 'A simple drum kit game built with HTML, CSS & JavaScript. Play different sounds by pressing the keys.',
            GDriveID: "1ejz6HO0-UO0AzVIf-7I9NM4WEz-MuhRT",
            techStack: ['HTML', 'CSS', 'JavaScript'],
            demoLink: 'https://akshit-bansal11.github.io/drum-kit/',
            githubLink: 'https://github.com/akshit-bansal11/drum-kit'
        },
        {
            type: 'small',
            title: 'Memory Game',
            description: 'A fun and modern Memory Game built with React, Vite, Tailwind CSS, Framer Motion, and React Icons.',
            GDriveID: "1Mj6liVIv1aofQI8vghKLggzBlv3M4CWm",
            techStack: ['React', 'Tailwind'],
            demoLink: 'https://memory-game-akshit-bansal11.vercel.app/',
            githubLink: 'https://github.com/akshit-bansal11/memory-game'
        },
        {
            type: 'small',
            title: 'Tic Tac Toe',
            description: 'A simple tic tac toe game built with HTML, CSS & JavaScript to against your friends.',
            GDriveID: "1kNEVXin8r_cT9yOMBRPrdGV1tmBLIOJw",
            techStack: ['HTML', 'CSS', 'JavaScript'],
            demoLink: 'https://akshit-bansal11.github.io/tic-tac-toe/',
            githubLink: 'https://github.com/akshit-bansal11/tic-tac-toe'
        },
        {
            type: 'small',
            title: 'Batting Strike Calculator',
            description: 'A simple batting strike calculator built with Python. Calculate your batting strike rate and average.',
            GDriveID: "1XrsTNP5zjki8ABpnRoUQX-ssM2vgOq8x",
            techStack: ['Python'],
            githubLink: 'https://github.com/akshit-bansal11/batting-strike-calculator'
        }
    ],
    tools: [
        {
            type: 'small',
            title: 'Bar Clock',
            description: 'A simple bar clock built with React & Tailwind. Displays the current time in a unique way.',
            GDriveID: "1TXRLBAgVKxXP6y8hVkldOMx2eBTYF9ll",
            techStack: ['React', 'Tailwind'],
            githubLink: 'https://akshit-bansal11.github.io/bar-clock/',
            demoLink: 'https://bar-clock-akshit-bansal11.vercel.app/'
        },
        {
            type: 'small',
            title: 'Audio Visualizer',
            description: 'A Real-Time Audio Visualizer built with C# & .NET. Visualizes the audio from all sources and from any audio device connected to the system.',
            GDriveID: "1XrsTNP5zjki8ABpnRoUQX-ssM2vgOq8x",
            techStack: ['C#', '.NET'],
            githubLink: 'https://github.com/akshit-bansal11/audio-visualizer'
        },
        {
            type: 'small',
            title: 'Counter',
            description: 'A simple click counter built with React & Tailwind. Click the button to increase the count.',
            GDriveID: "1jS6Xkx30U5Xu18b0n59HAyHarwSTJmGK",
            techStack: ['React', 'Tailwind'],
            demoLink: 'https://counter-akshit-bansal11.vercel.app/',
            githubLink: 'https://github.com/akshit-bansal11/counter/'
        },
        {
            type: 'small',
            title: 'Analog + Digital Clock',
            description: 'A simple analog and digital clock built with HTML, Tailwind & Vanilla JavaScript. Displays the current time in both analog and digital formats.',
            GDriveID: "1pwID1hVLiMiH5DMx5tdugb5nQ4O236Io",
            techStack: ['HTML', 'Tailwind', 'JavaScript'],
            githubLink: 'https://github.com/akshit-bansal11/analog-digital-clock',
            demoLink: 'https://akshit-bansal11.github.io/analog-digital-clock/'
        },
        {
            type: 'small',
            title: 'To Do List',
            description: 'A simple to-do list application built with React & Tailwind. Add, edit, and delete tasks easily.',
            GDriveID: "1uKOvrjtr2zEqqXb-y2w5uR_sU2CB8G79",
            techStack: ['React', 'Tailwind'],
            githubLink: 'https://github.com/akshit-bansal11/to-do-list',
            demoLink: 'https://to-do-list-akshit-bansal11.vercel.app/'
        },
        {
            type: 'small',
            title: 'Digital Clock',
            description: 'A simple digital clock built with HTML, Tailwind & Vanilla JavaScript.',
            GDriveID: "1xvrg4vDrll3iIF_TTP5p-BjTsYFUO3NR",
            techStack: ['HTML', 'Tailwind', 'JavaScript'],
            githubLink: 'https://github.com/akshit-bansal11/digital-clock',
            demoLink: 'https://akshit-bansal11.github.io/digital-clock/'
        },
        {
            type: 'small',
            title: 'C++ Login/Signup System',
            description: 'A simple login/signup system built with C++. It allows users to register and login with a username and password.',
            GDriveID: "1XrsTNP5zjki8ABpnRoUQX-ssM2vgOq8x",
            techStack: ['C++'],
            githubLink: 'https://github.com/akshit-bansal11/cpp-login-signup'
        },
        {
            type: 'small',
            title: 'Simple Calculator',
            description: 'A simple calculator built with HTML, CSS & JavaScript. Perform basic arithmetic operations.',
            GDriveID: "1RF_l5RkpT6qxUOlIkPyfJpkTAsszUZKx",
            techStack: ['HTML', 'CSS', 'JavaScript'],
            githubLink: 'https://github.com/akshit-bansal11/simple-calculator',
            demoLink: 'https://akshit-bansal11.github.io/simple-calculator/'
        }
    ],
    designs: [
        {
            type: 'large',
            title: 'IPO Dashboard - Bluestock Fintech',
            description: "A dashboard design for Bluestock Fintech's IPO section, showcasing the latest IPOs, upcoming IPOs, and past IPOs.",
            GDriveID: "1wVR_WZqPkf_EjwytRJsDrC1pC8F2pE",
            techStack: ['Figma'],
            designLink: 'https://www.figma.com/design/IyF5MKCS7GP2ChFBOiWXAK/bluestock-fintech-ui-ux-team?node-id=0-1&p=f&t=uex6AqWahwZjsA3R-0'
        },
        {
            type: 'large',
            title: 'E-Commerce Website Template',
            description: 'A modern e-commerce website template designed for a fictional clothing store, featuring a clean and user-friendly interface.',
            GDriveID: "1D2WSLJVx4VSchxG73Hi74Vhjiwmw2DQn",
            techStack: ['Figma'],
            designLink: 'https://www.figma.com/design/32zeVVPSZBHL9GFSEXUqHp/Ecom-base?node-id=1-3&p=f&t=JxJOvK2iMlsW3gJ2-0/'
        }
    ],
    scripts: [
        {
            type: 'smallWimg',
            title: 'Merge Folders',
            description: 'A python script to merge two or more folders.',
            GDriveID: "",
            techStack: ['Python'],
            githubLink: 'https://github.com/akshit-bansal11/useful-scripts'
        },
        {
            type: 'smallWimg',
            title: 'Audio Converter',
            description: 'A python script to convert audio files from one format to another.',
            GDriveID: "",
            techStack: ['Python'],
            githubLink: 'https://github.com/akshit-bansal11/useful-scripts'
        }
    ]
}
