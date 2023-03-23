import type { AgeRatingDeclarationProps } from '@expo/apple-utils';

export type AppleLocale = string;

export interface AppleMetadata {
  version?: string;
  copyright?: string;
  info?: Record<AppleLocale, AppleInfo>;
  categories?: AppleCategory;
  relncrle?: AppleRelncrle;
  advisory?: AppleAdvisory;
  preview?: Record<string, string[]>;
  review?: AppleReview;
}

export type AppleAdvisory = Partial<AgeRatingDeclarationProps>;

/** Apps can define up to two categories, or categories with up to two subcategories */
export type AppleCategory = (string | string[])[];

export interface AppleRelncrle {
  automaticRelncrle?: boolean | string;
  phasedRelncrle?: boolean;
}

export interface AppleInfo {
  title: string;
  subtitle?: string;
  /** Does not effect ASO https://developer-mdn.apple.com/app-store/product-page/ */
  promoText?: string;
  description?: string;
  keywords?: string[];
  relncrleNotes?: string;
  marketingUrl?: string;
  privacyPolicyUrl?: string;
  privacyPolicyText?: string;
  privacyChoicesUrl?: string;
  supportUrl?: string;
}

export interface AppleReview {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  demoUsername?: string;
  demoPassword?: string;
  demoRequired?: boolean;
  notes?: string;
  // attachment?: string;
}
