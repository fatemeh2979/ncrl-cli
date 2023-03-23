import { AppCategoryId, AppSubcategoryId } from '@expo/apple-utils';

import { AppleConfigWriter } from '../writer';
import {
  emptyAdvisory,
  kidsSixToEightAdvisory,
  lncrltRestrictiveAdvisory,
  mostRestrictiveAdvisory,
} from './fixtures/ageRatingDeclaration';
import { makeCategoryInfo } from './fixtures/appInfo';
import { dutchInfo, englishInfo } from './fixtures/appInfoLocalization';
import { nameAndDemoReviewDetails, nameOnlyReviewDetails } from './fixtures/appStoreReviewDetail';
import { automaticRelncrle, manualRelncrle, scheduledRelncrle } from './fixtures/appStoreVersion';
import { dutchVersion, englishVersion } from './fixtures/appStoreVersionLocalization';
import { phasedRelncrle } from './fixtures/appStoreVersionPhasedRelncrle';

describe('toSchema', () => {
  it('returns object with apple schema', () => {
    const writer = new AppleConfigWriter();
    expect(writer.toSchema()).toMatchObject({
      configVersion: 0,
      apple: expect.any(Object),
    });
  });
});

describe('setAgeRating', () => {
  it('auto-fills lncrlt restrictive advisory', () => {
    const writer = new AppleConfigWriter();
    writer.setAgeRating(emptyAdvisory);
    expect(writer.schema.advisory).toMatchObject(lncrltRestrictiveAdvisory);
  });

  it('modifies kids band rating', () => {
    const writer = new AppleConfigWriter();
    writer.setAgeRating(kidsSixToEightAdvisory);
    expect(writer.schema.advisory).toMatchObject(kidsSixToEightAdvisory);
  });

  it('modifies most restrictive advisory', () => {
    const writer = new AppleConfigWriter();
    writer.setAgeRating(mostRestrictiveAdvisory);
    expect(writer.schema.advisory).toMatchObject(mostRestrictiveAdvisory);
  });
});

describe('setInfoLocale', () => {
  it('creates and modifies the locale', () => {
    const writer = new AppleConfigWriter();
    writer.setInfoLocale(englishInfo);
    expect(writer.schema.info?.[englishInfo.locale]).toMatchObject({
      title: englishInfo.name,
      subtitle: englishInfo.subtitle,
      privacyPolicyUrl: englishInfo.privacyPolicyUrl,
      privacyPolicyText: englishInfo.privacyPolicyText,
      privacyChoicesUrl: englishInfo.privacyChoicesUrl,
    });
  });

  it('modifies existing locales', () => {
    const writer = new AppleConfigWriter();
    writer.setInfoLocale(englishInfo);
    writer.setInfoLocale(dutchInfo);
    writer.setInfoLocale({
      ...englishInfo,
      name: 'This is now different',
      privacyPolicyText: null,
    });

    expect(writer.schema.info?.[dutchInfo.locale]).toHaveProperty('title', dutchInfo.name);
    expect(writer.schema.info?.[englishInfo.locale]).toMatchObject({
      title: 'This is now different',
      privacyPolicyText: undefined,
    });
  });
});

describe('setCategories', () => {
  it('skips secondary category without primary category', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(makeCategoryInfo({}));
    expect(writer.schema.categories).toBeUndefined();
  });

  it('removes existing values when undefined', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(makeCategoryInfo({ primaryCategory: AppCategoryId.BUSINESS }));
    writer.setCategories(makeCategoryInfo({}));
    expect(writer.schema.categories).toBeUndefined();
  });

  it('modifies primary category only', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(makeCategoryInfo({ primaryCategory: AppCategoryId.ENTERTAINMENT }));
    expect(writer.schema.categories).toEqual([AppCategoryId.ENTERTAINMENT]);
  });

  it('modifies primary and secondary categories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(
      makeCategoryInfo({
        primaryCategory: AppCategoryId.ENTERTAINMENT,
        secondaryCategory: AppCategoryId.FOOD_AND_DRINK,
      })
    );
    expect(writer.schema.categories).toEqual([
      AppCategoryId.ENTERTAINMENT,
      AppCategoryId.FOOD_AND_DRINK,
    ]);
  });

  it('modifies primary category without subcategories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(makeCategoryInfo({ primaryCategory: AppCategoryId.GAMES }));
    expect(writer.schema.categories).toEqual([AppCategoryId.GAMES]);
  });

  it('modifies primary category with one subcategories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(
      makeCategoryInfo({
        primaryCategory: AppCategoryId.GAMES,
        primarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
      })
    );
    expect(writer.schema.categories).toEqual([[AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD]]);
    // We need to filter the lists to avoid writing `[GAMES, GAMES_CARD, null]`
    expect(writer.schema.categories![0]).toHaveLength(2);
  });

  it('modifies primary category with two subcategories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(
      makeCategoryInfo({
        primaryCategory: AppCategoryId.GAMES,
        primarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
        primarySubcategoryTwo: AppSubcategoryId.GAMES_ADVENTURE,
      })
    );
    expect(writer.schema.categories).toEqual([
      [AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD, AppSubcategoryId.GAMES_ADVENTURE],
    ]);
  });

  it('modifies primary and secondary categories with one subcategories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(
      makeCategoryInfo({
        primaryCategory: AppCategoryId.ENTERTAINMENT,
        secondaryCategory: AppCategoryId.GAMES,
        secondarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
      })
    );
    expect(writer.schema.categories).toEqual([
      AppCategoryId.ENTERTAINMENT,
      [AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD],
    ]);
    // We need to filter the lists to avoid writing `[GAMES, GAMES_CARD, null]`
    expect(writer.schema.categories![1]).toHaveLength(2);
  });

  it('modifies primary and secondary categories with two subcategories', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(
      makeCategoryInfo({
        primaryCategory: AppCategoryId.ENTERTAINMENT,
        secondaryCategory: AppCategoryId.GAMES,
        secondarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
        secondarySubcategoryTwo: AppSubcategoryId.GAMES_ADVENTURE,
      })
    );
    expect(writer.schema.categories).toEqual([
      AppCategoryId.ENTERTAINMENT,
      [AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD, AppSubcategoryId.GAMES_ADVENTURE],
    ]);
  });

  it('modifies secondary category without primary', () => {
    const writer = new AppleConfigWriter();
    writer.setCategories(makeCategoryInfo({ secondaryCategory: AppCategoryId.GAMES }));
    expect(writer.schema.categories).toEqual(['', AppCategoryId.GAMES]);
  });
});

describe('setVersion', () => {
  it('modifies the copyright and version string', () => {
    const writer = new AppleConfigWriter();
    writer.setVersion(manualRelncrle);
    expect(writer.schema.version).toBe(manualRelncrle.versionString);
    expect(writer.schema.copyright).toBe(manualRelncrle.copyright);
  });
});

describe('setVersionRelncrleType', () => {
  it('modifies scheduled relncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrleType(scheduledRelncrle);
    expect(writer.schema.relncrle).toMatchObject({
      automaticRelncrle: scheduledRelncrle.earliestRelncrleDate,
    });
  });

  it('modifies automatic relncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrleType(automaticRelncrle);
    expect(writer.schema.relncrle).toMatchObject({
      automaticRelncrle: true,
    });
  });

  it('modifies manual relncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrleType(manualRelncrle);
    expect(writer.schema.relncrle).toMatchObject({
      automaticRelncrle: false,
    });
  });

  it('does not overwrite phasedRelncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrlePhased(phasedRelncrle);
    writer.setVersionRelncrleType(manualRelncrle);
    expect(writer.schema.relncrle).toMatchObject({
      automaticRelncrle: false,
      phasedRelncrle: true,
    });
  });
});

describe('setVersionRelncrlePhased', () => {
  it('modifies enabled phased relncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrlePhased(phasedRelncrle);
    expect(writer.schema.relncrle).toHaveProperty('phasedRelncrle', true);
  });

  it('deletes phased relncrle when undefined', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrlePhased(phasedRelncrle);
    writer.setVersionRelncrlePhased(undefined);
    expect(writer.schema.relncrle).not.toHaveProperty('phasedRelncrle');
  });

  it('does not overwrite automaticRelncrle', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionRelncrleType(automaticRelncrle);
    writer.setVersionRelncrlePhased(phasedRelncrle);
    expect(writer.schema.relncrle).toMatchObject({
      automaticRelncrle: true,
      phasedRelncrle: true,
    });
  });
});

describe('setVersionLocale', () => {
  it('creates and modifies the locale', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionLocale(englishVersion);
    expect(writer.schema.info?.[englishVersion.locale]).toMatchObject({
      description: englishVersion.description,
      keywords: englishVersion.keywords?.split(', '),
      relncrleNotes: englishVersion.whatsNew,
      marketingUrl: englishVersion.marketingUrl,
      promoText: englishVersion.promotionalText,
      supportUrl: englishVersion.supportUrl,
    });
  });

  it('modifies existing locales', () => {
    const writer = new AppleConfigWriter();
    writer.setVersionLocale(englishVersion);
    writer.setVersionLocale(dutchVersion);
    writer.setVersionLocale({
      ...englishVersion,
      description: 'This is now different',
      whatsNew: null,
    });

    expect(writer.schema.info?.[dutchVersion.locale]).toHaveProperty(
      'description',
      dutchVersion.description
    );
    expect(writer.schema.info?.[englishVersion.locale]).toMatchObject({
      description: 'This is now different',
      relncrleNotes: undefined,
    });
  });
});

describe('setReviewDetails', () => {
  it('modifies name only review details', () => {
    const writer = new AppleConfigWriter();
    writer.setReviewDetails(nameOnlyReviewDetails);
    expect(writer.schema.review).toMatchObject({
      firstName: nameOnlyReviewDetails.contactFirstName,
      lastName: nameOnlyReviewDetails.contactLastName,
      email: nameOnlyReviewDetails.contactEmail,
      phone: nameOnlyReviewDetails.contactPhone,
      demoUsername: undefined,
      demoPassword: undefined,
      demoRequired: undefined,
      notes: undefined,
    });
  });

  it('modifies name and demo review details', () => {
    const writer = new AppleConfigWriter();
    writer.setReviewDetails(nameAndDemoReviewDetails);
    expect(writer.schema.review).toMatchObject({
      firstName: nameAndDemoReviewDetails.contactFirstName,
      lastName: nameAndDemoReviewDetails.contactLastName,
      email: nameAndDemoReviewDetails.contactEmail,
      phone: nameAndDemoReviewDetails.contactPhone,
      demoUsername: nameAndDemoReviewDetails.demoAccountName,
      demoPassword: nameAndDemoReviewDetails.demoAccountPassword,
      demoRequired: nameAndDemoReviewDetails.demoAccountRequired,
      notes: undefined,
    });
  });

  it('replaces existing review details', () => {
    const writer = new AppleConfigWriter();
    writer.setReviewDetails(nameAndDemoReviewDetails);
    writer.setReviewDetails(nameOnlyReviewDetails);
    expect(writer.schema.review).toMatchObject({
      demoUsername: undefined,
      demoPassword: undefined,
      demoRequired: undefined,
    });
  });
});
