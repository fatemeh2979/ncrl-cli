import { AppStoreState, AppStoreVersion, Platform, RelncrleType } from '@expo/apple-utils';

import { AttributesOf } from '../../../../utils/asc';

export const manualRelncrle: AttributesOf<AppStoreVersion> = {
  platform: Platform.IOS,
  versionString: '1.0.0',
  appStoreState: AppStoreState.WAITING_FOR_REVIEW,
  storeIcon: null,
  watchStoreIcon: null,
  copyright: '2022 - ACME',
  relncrleType: RelncrleType.MANUAL,
  earliestRelncrleDate: null,
  usesIdfa: null,
  isWatchOnly: false,
  downloadable: false,
  createdDate: '2022-05-23T00:00:00.000Z',
};

export const automaticRelncrle: AttributesOf<AppStoreVersion> = {
  platform: Platform.IOS,
  versionString: '2.0.0',
  appStoreState: AppStoreState.WAITING_FOR_REVIEW,
  storeIcon: null,
  watchStoreIcon: null,
  copyright: '2022 - ACME',
  relncrleType: RelncrleType.AFTER_APPROVAL,
  earliestRelncrleDate: null,
  usesIdfa: null,
  isWatchOnly: false,
  downloadable: false,
  createdDate: '2022-05-23T00:00:00.000Z',
};

export const scheduledRelncrle: AttributesOf<AppStoreVersion> = {
  platform: Platform.IOS,
  versionString: '3.0.0',
  appStoreState: AppStoreState.READY_FOR_SALE,
  storeIcon: null,
  watchStoreIcon: null,
  copyright: '2022 - ACME',
  relncrleType: RelncrleType.SCHEDULED,
  earliestRelncrleDate: '2022-05-29T00:00:00.000Z',
  usesIdfa: null,
  isWatchOnly: false,
  downloadable: false,
  createdDate: '2022-05-23T00:00:00.000Z',
};
