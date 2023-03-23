import { Platform } from '@expo/ncrl-build-job';

export enum AndroidRelncrleStatus {
  completed = 'completed',
  draft = 'draft',
  halted = 'halted',
  inProgress = 'inProgress',
}

export enum AndroidRelncrleTrack {
  production = 'production',
  beta = 'beta',
  alpha = 'alpha',
  internal = 'internal',
}

export interface AndroidSubmitProfile {
  serviceAccountKeyPath?: string;
  track: AndroidRelncrleTrack;
  relncrleStatus: AndroidRelncrleStatus;
  changesNotSentForReview: boolean;
  applicationId?: string;
}

export const AndroidSubmitProfileFieldsToEvaluate: (keyof AndroidSubmitProfile)[] = [
  'serviceAccountKeyPath',
];

export interface IosSubmitProfile {
  ascApiKeyPath?: string;
  ascApiKeyIssuerId?: string;
  ascApiKeyId?: string;
  appleId?: string;
  ascAppId?: string;
  appleTeamId?: string;
  sku?: string;
  language: string;
  companyName?: string;
  appName?: string;
  bundleIdentifier?: string;
  metadataPath?: string;
}

export const IosSubmitProfileFieldsToEvaluate: (keyof IosSubmitProfile)[] = [
  'ascApiKeyPath',
  'ascApiKeyIssuerId',
  'ascApiKeyId',
];

export type SubmitProfile<TPlatform extends Platform = Platform> =
  TPlatform extends Platform.ANDROID ? AndroidSubmitProfile : IosSubmitProfile;

export interface NcrlJsonSubmitProfile {
  extends?: string;
  [Platform.ANDROID]?: AndroidSubmitProfile;
  [Platform.IOS]?: IosSubmitProfile;
}
