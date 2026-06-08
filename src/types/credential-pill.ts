/*
 * credential-pill.ts
 * Unified shape consumed by the CredentialPill component.
 * Both GoogleBadgeItem and CertificationItem map into this
 * shape so a single pill component renders either entity.
 */

export interface CredentialPillItem {
	/** URL of the provider/issuer icon (e.g. Google Cloud, LinkedIn). */
	iconUrl: string;
	/** Alt text for the icon image. */
	iconAlt: string;
	/** Credential or badge title. */
	title: string;
	/** Provider name shown below the title (e.g. "Google Cloud", "LinkedIn & Microsoft"). */
	provider: string;
	/** External link to the credential proof. */
	href: string;
}
