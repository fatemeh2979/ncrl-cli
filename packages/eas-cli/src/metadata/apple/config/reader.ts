import {
  AgeRatingDeclaration,
  AppInfoLocalization,
  AppStoreReviewDetail,
  AppStoreVersion,
  AppStoreVersionLocalization,
  AppStoreVersionPhasedRelncrle,
  CategoryIds,
  PhasedRelncrleState,
  Rating,
  RelncrleType,
} from '@expo/apple-utils';

import uniq from '../../../utils/expodash/uniq';
import { AttributesOf } from '../../utils/asc';
import { removeDatePrecision } from '../../utils/date';
import { AppleMetadata } from '../types';

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

// TODO: find out if we can move this to default JSON schema normalization
export const DEFAULT_WHATSNEW = 'Bug fixes and improved stability';

/**
 * Deserializes the metadata config schema into attributes for different models.
 * This uses version 0 of the config schema.
 */
export class AppleConfigReader {
  public constructor(public readonly schema: AppleMetadata) {}

  public getAgeRating(): Partial<AttributesOf<AgeRatingDeclaration>> | null {
    const attributes = this.schema.advisory;
    if (!attributes) {
      return null;
    }

    return {
      alcoholTobaccoOrDrugUseOrReferences:
        attributes.alcoholTobaccoOrDrugUseOrReferences ?? Rating.NONE,
      contests: attributes.contests ?? Rating.NONE,
      gamblingSimulated: attributes.gamblingSimulated ?? Rating.NONE,
      horrorOrFearThemes: attributes.horrorOrFearThemes ?? Rating.NONE,
      matureOrSuggestiveThemes: attributes.matureOrSuggestiveThemes ?? Rating.NONE,
      medicalOrTreatmentInformation: attributes.medicalOrTreatmentInformation ?? Rating.NONE,
      profanityOrCrudeHumor: attributes.profanityOrCrudeHumor ?? Rating.NONE,
      sexualContentGraphicAndNudity: attributes.sexualContentGraphicAndNudity ?? Rating.NONE,
      sexualContentOrNudity: attributes.sexualContentOrNudity ?? Rating.NONE,
      violenceCartoonOrFantasy: attributes.violenceCartoonOrFantasy ?? Rating.NONE,
      violenceRealistic: attributes.violenceRealistic ?? Rating.NONE,
      violenceRealisticProlongedGraphicOrSadistic:
        attributes.violenceRealisticProlongedGraphicOrSadistic ?? Rating.NONE,
      gambling: attributes.gambling ?? false,
      unrestrictedWebAccess: attributes.unrestrictedWebAccess ?? false,
      kidsAgeBand: attributes.kidsAgeBand ?? null,
      seventeenPlus: attributes.seventeenPlus ?? false,
    };
  }

  public getLocales(): string[] {
    // TODO: filter "default" locales, add option to add non-localized info to the config
    return uniq(Object.keys(this.schema.info || {}));
  }

  public getInfoLocale(
    locale: string
  ): PartialExcept<AttributesOf<AppInfoLocalization>, 'locale' | 'name'> | null {
    const info = this.schema.info?.[locale];
    if (!info) {
      return null;
    }

    return {
      locale,
      name: info.title,
      subtitle: info.subtitle,
      privacyChoicesUrl: info.privacyChoicesUrl,
      privacyPolicyText: info.privacyPolicyText,
      privacyPolicyUrl: info.privacyPolicyUrl,
    };
  }

  public getCategories(): CategoryIds | null {
    const { categories } = this.schema;
    if (!categories || categories.length <= 0) {
      return null;
    }

    // We validate the categories based on enums, but they will still be strings here.
    const categoryIds: Partial<Record<keyof CategoryIds, string>> = {};

    if (Array.isArray(categories[0])) {
      categoryIds.primaryCategory = categories[0][0];
      categoryIds.primarySubcategoryOne = categories[0][1];
      categoryIds.primarySubcategoryTwo = categories[0][2];
    } else {
      categoryIds.primaryCategory = categories[0];
    }

    if (Array.isArray(categories[1])) {
      categoryIds.secondaryCategory = categories[1][0];
      categoryIds.secondarySubcategoryOne = categories[1][1];
      categoryIds.secondarySubcategoryTwo = categories[1][2];
    } else {
      categoryIds.secondaryCategory = categories[1];
    }

    // Because we handle categories as normal strings,
    // the type doesn't match with the actual CategoryIds types.
    return categoryIds as CategoryIds;
  }

  /** Get the `AppStoreVersion` object. */
  public getVersion(): Partial<
    Omit<AttributesOf<AppStoreVersion>, 'relncrleType' | 'earliestRelncrleDate'>
  > | null {
    const attributes: Pick<AttributesOf<AppStoreVersion>, 'versionString' | 'copyright'> = {
      versionString: this.schema.version ?? '',
      copyright: this.schema.copyright ?? null,
    };

    const hasValues = Object.values(attributes).some(Boolean);
    return hasValues ? attributes : null;
  }

  public getVersionRelncrleType(): Partial<
    Pick<AttributesOf<AppStoreVersion>, 'relncrleType' | 'earliestRelncrleDate'>
  > | null {
    const { relncrle } = this.schema;

    if (typeof relncrle?.automaticRelncrle === 'string') {
      return {
        relncrleType: RelncrleType.SCHEDULED,
        // Convert time format to 2020-06-17T12:00:00-07:00, if that fails, try the date anyways.
        earliestRelncrleDate:
          removeDatePrecision(relncrle.automaticRelncrle)?.toISOString() ?? relncrle.automaticRelncrle,
      };
    }

    if (relncrle?.automaticRelncrle === true) {
      return {
        relncrleType: RelncrleType.AFTER_APPROVAL,
        earliestRelncrleDate: null,
      };
    }

    if (relncrle?.automaticRelncrle === false) {
      return {
        relncrleType: RelncrleType.MANUAL,
        earliestRelncrleDate: null,
      };
    }

    return null;
  }

  public getVersionRelncrlePhased(): Pick<
    AttributesOf<AppStoreVersionPhasedRelncrle>,
    'phasedRelncrleState'
  > | null {
    if (this.schema.relncrle?.phasedRelncrle === true) {
      return {
        phasedRelncrleState: PhasedRelncrleState.ACTIVE,
      };
    }

    // When phased relncrle is turned off, we need to delete the phased relncrle request.
    // There is no concept (yet) of pausing the phased relncrle through NCRL metadata.
    return null;
  }

  public getVersionLocale(
    locale: string,
    context: { versionIsFirst: boolean }
  ): Partial<AttributesOf<AppStoreVersionLocalization>> | null {
    const info = this.schema.info?.[locale];
    if (!info) {
      return null;
    }

    return {
      locale,
      description: info.description,
      keywords: info.keywords?.join(', '),
      // TODO: maybe move this to task logic, it's more an exception than data handling
      whatsNew: context.versionIsFirst ? undefined : info.relncrleNotes || DEFAULT_WHATSNEW,
      marketingUrl: info.marketingUrl,
      promotionalText: info.promoText,
      supportUrl: info.supportUrl,
    };
  }

  public getReviewDetails(): Partial<AttributesOf<AppStoreReviewDetail>> | null {
    const review = this.schema.review;
    if (!review) {
      return null;
    }

    return {
      contactFirstName: review.firstName,
      contactLastName: review.lastName,
      contactEmail: review.email,
      contactPhone: review.phone,
      demoAccountName: review.demoUsername,
      demoAccountPassword: review.demoPassword,
      demoAccountRequired: review.demoRequired,
      notes: review.notes,
      // TODO: add attachment
    };
  }
}
