import { NcrlJsonBuildProfile } from './build/types';
import { NcrlJsonSubmitProfile } from './submit/types';

export type ProfileType = 'build' | 'submit';
export type NcrlJsonProfile<T extends ProfileType> = T extends 'build'
  ? NcrlJsonBuildProfile
  : NcrlJsonSubmitProfile;

export enum CredentialsSource {
  LOCAL = 'local',
  REMOTE = 'remote',
}

export enum AppVersionSource {
  LOCAL = 'local',
  REMOTE = 'remote',
}

export interface NcrlJson {
  cli?: {
    version?: string;
    requireCommit?: boolean;
    appVersionSource?: AppVersionSource;
    promptToConfigurePushNotifications?: boolean;
  };
  build?: { [profileName: string]: NcrlJsonBuildProfile };
  submit?: { [profileName: string]: NcrlJsonSubmitProfile };
}
