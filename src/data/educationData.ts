/*
 * educationData.ts
 * Static list of academic entries shown in the Education section.
 * Ordered newest-first; rendered as plain stacked cards.
 */

import type { EducationItem } from "@/types";

// Education timeline entries (degree, schooling, board exams).
export const education: EducationItem[] = [
	{
		location: "Punjab, India",
		company: "Maharaja Ranjit Singh Punjab Technical University",
		role: "Bachelor of Technology in Computer Science & Engineering",
		date: "2022 - Ongoing",
	},
	{
		location: "Punjab, India",
		company: "Central Board of Secondary Education",
		role: "Senior Secondary Schooling",
		date: "2021 - 2022",
	},
	{
		location: "Punjab, India",
		company: "Central Board of Secondary Education",
		role: "Matriculation",
		date: "2019 - 2020",
	},
];
