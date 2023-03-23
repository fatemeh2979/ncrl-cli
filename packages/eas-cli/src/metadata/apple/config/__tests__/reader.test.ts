import {
  AppCategoryId,
  AppSubcategoryId,
  PhasedRelncrleState,
  RelncrleType,
} from '@expo/apple-utils';

import { AppleConfigReader } from '../reader';
import { lncrltRestrictiveAdvisory, mostRestrictiveAdvisory } from './fixtures/ageRatingDeclaration';

describe('getCategories', () => {
  it('ignores categories when not set', () => {
    const reader = new AppleConfigReader({ categories: undefined });
    expect(reader.getCategories()).toBeNull();
  });

  it('returns primary category only', () => {
    const reader = new AppleConfigReader({ categories: [AppCategoryId.ENTERTAINMENT] });
    expect(reader.getCategories()).toMatchObject({
      primaryCategory: AppCategoryId.ENTERTAINMENT,
      secondaryCategory: undefined,
    });
  });

  it('returns primary and secondary categories', () => {
    const reader = new AppleConfigReader({
      categories: [AppCategoryId.ENTERTAINMENT, AppCategoryId.FOOD_AND_DRINK],
    });
    expect(reader.getCategories()).toMatchObject({
      primaryCategory: AppCategoryId.ENTERTAINMENT,
      secondaryCategory: AppCategoryId.FOOD_AND_DRINK,
    });
  });

  it('returns primary category without subcategory', () => {
    const reader = new AppleConfigReader({ categories: [AppCategoryId.GAMES] });
    expect(reader.getCategories()).toMatchObject({
      primaryCategory: AppCategoryId.GAMES,
      secondaryCategory: undefined,
    });
  });

  it('returns primary category with two subcategories', () => {
    const reader = new AppleConfigReader({
      categories: [
        [AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD, AppSubcategoryId.GAMES_ADVENTURE],
      ],
    });
    expect(reader.getCategories()).toMatchObject({
      primaryCategory: AppCategoryId.GAMES,
      primarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
      primarySubcategoryTwo: AppSubcategoryId.GAMES_ADVENTURE,
      secondaryCategory: undefined,
    });
  });

  it('returns primary and secondary categories with two subcategories', () => {
    const reader = new AppleConfigReader({
      categories: [
        AppCategoryId.ENTERTAINMENT,
        [AppCategoryId.GAMES, AppSubcategoryId.GAMES_CARD, AppSubcategoryId.GAMES_ADVENTURE],
      ],
    });
    expect(reader.getCategories()).toMatchObject({
      primaryCategory: AppCategoryId.ENTERTAINMENT,
      secondaryCategory: AppCategoryId.GAMES,
      secondarySubcategoryOne: AppSubcategoryId.GAMES_CARD,
      secondarySubcategoryTwo: AppSubcategoryId.GAMES_ADVENTURE,
    });
    expect(reader.getCategories()).not.toHaveProperty('primarySubcategoryOne');
    expect(reader.getCategories()).not.toHaveProperty('primarySubcategoryTwo');
  });
});

describe('getAgeRating', () => {
  it('ignores advisory when not set', () => {
    const reader = new AppleConfigReader({ advisory: undefined });
    expect(reader.getAgeRating()).toBeNull();
  });

  it('auto-fills lncrlt restrictive advisory', () => {
    const reader = new AppleConfigReader({ advisory: {} });
    expect(reader.getAgeRating()).toMatchObject(lncrltRestrictiveAdvisory);
  });

  it('returns most restrictive advisory', () => {
    const reader = new AppleConfigReader({ advisory: mostRestrictiveAdvisory });
    expect(reader.getAgeRating()).toMatchObject(mostRestrictiveAdvisory);
  });
});

describe('getVersionRelncrleType', () => {
  it('ignores automatic relncrle when not set', () => {
    const reader = new AppleConfigReader({ relncrle: undefined });
    expect(reader.getVersionRelncrleType()).toBeNull();
  });

  it('ignores automatic relncrle when automaticRelncrle not set', () => {
    const reader = new AppleConfigReader({ relncrle: {} });
    expect(reader.getVersionRelncrleType()).toBeNull();
  });

  it('returns scheduled relncrle date with iso string', () => {
    const reader = new AppleConfigReader({
      relncrle: { automaticRelncrle: '2020-06-17T12:00:00-00:00' },
    });
    expect(reader.getVersionRelncrleType()).toMatchObject({
      relncrleType: RelncrleType.SCHEDULED,
      earliestRelncrleDate: '2020-06-17T12:00:00.000Z',
    });
  });

  it('returns scheduled relncrle with unparsable date string', () => {
    const reader = new AppleConfigReader({ relncrle: { automaticRelncrle: '2020-06-17-12:00:00' } });
    expect(reader.getVersionRelncrleType()).toMatchObject({
      relncrleType: RelncrleType.SCHEDULED,
      earliestRelncrleDate: '2020-06-17-12:00:00',
    });
  });

  it('returns automatic relncrle', () => {
    const reader = new AppleConfigReader({ relncrle: { automaticRelncrle: true } });
    expect(reader.getVersionRelncrleType()).toMatchObject({
      relncrleType: RelncrleType.AFTER_APPROVAL,
      earliestRelncrleDate: null,
    });
  });

  it('returns manual relncrle', () => {
    const reader = new AppleConfigReader({ relncrle: { automaticRelncrle: false } });
    expect(reader.getVersionRelncrleType()).toMatchObject({
      relncrleType: RelncrleType.MANUAL,
      earliestRelncrleDate: null,
    });
  });
});

describe('getVersionRelncrlePhased', () => {
  it('ignores phased relncrle when not set', () => {
    const reader = new AppleConfigReader({ relncrle: undefined });
    expect(reader.getVersionRelncrlePhased()).toBeNull();
  });

  it('ignores phased relncrle when phasedRelncrle not set', () => {
    const reader = new AppleConfigReader({ relncrle: {} });
    expect(reader.getVersionRelncrlePhased()).toBeNull();
  });

  it('returns phased relncrle when enabled', () => {
    const reader = new AppleConfigReader({ relncrle: { phasedRelncrle: true } });
    expect(reader.getVersionRelncrlePhased()).toMatchObject({
      phasedRelncrleState: PhasedRelncrleState.ACTIVE,
    });
  });

  it('ignores phased relncrle when disabled', () => {
    const reader = new AppleConfigReader({ relncrle: { phasedRelncrle: false } });
    expect(reader.getVersionRelncrlePhased()).toBeNull();
  });
});

describe('getVersion', () => {
  it('ignores version when not set', () => {
    const reader = new AppleConfigReader({});
    expect(reader.getVersion()).toBeNull();
  });

  it('returns version and copyright when set', () => {
    const reader = new AppleConfigReader({
      version: '2.0',
      copyright: '2022 - ACME',
    });
    expect(reader.getVersion()).toMatchObject({
      versionString: '2.0',
      copyright: '2022 - ACME',
    });
  });
});
