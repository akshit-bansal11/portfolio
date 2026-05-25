/*
 * testimonial.ts
 * Type definition for a single testimonial card entry.
 */

export interface TestimonialItem {
	id: string;
	name: string;
	email: string;
	role: string;
	company: string;
	initials: string;
	accentColor: string;
	text: string;
}
