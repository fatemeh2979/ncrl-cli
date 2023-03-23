import { Platform } from '@expo/ncrl-build-job';

import { MissingParentProfileError, MissingProfileError } from '../errors';
import { NcrlJson } from '../types';
import { BuildProfileSchema } from './schema';
import { BuildProfile, NcrlJsonBuildProfile } from './types';

type NcrlJsonBuildProfileResolved = Omit<NcrlJsonBuildProfile, 'extends'>;

export function resolveBuildProfile<T extends Platform>({
  ncrlJson,
  platform,
  profileName,
}: {
  ncrlJson: NcrlJson;
  platform: T;
  profileName?: string;
}): BuildProfile<T> {
  const ncrlJsonProfile = resolveProfile({
    ncrlJson,
    profileName: profileName ?? 'production',
  });
  const { android, ios, ...base } = ncrlJsonProfile;
  const withoutDefaults = mergeProfiles(
    base,
    (ncrlJsonProfile[platform] as NcrlJsonBuildProfileResolved) ?? {}
  );
  return mergeProfiles(getDefaultProfile(platform), withoutDefaults) as BuildProfile<T>;
}

function resolveProfile({
  ncrlJson,
  profileName,
  depth = 0,
}: {
  ncrlJson: NcrlJson;
  profileName: string;
  depth?: number;
}): NcrlJsonBuildProfileResolved {
  if (depth >= 5) {
    throw new Error(
      'Too long chain of profile extensions, make sure "extends" keys do not make a cycle'
    );
  }

  const profile = ncrlJson.build?.[profileName];
  if (!profile) {
    if (depth === 0) {
      throw new MissingProfileError(`Missing build profile in ncrl.json: ${profileName}`);
    } else {
      throw new MissingParentProfileError(
        `Extending non-existent build profile in ncrl.json: ${profileName}`
      );
    }
  }

  const { extends: baseProfileName, ...rest } = profile;
  if (baseProfileName) {
    const baseProfile = resolveProfile({
      ncrlJson,
      profileName: baseProfileName,
      depth: depth + 1,
    });
    return mergeProfiles(baseProfile, rest);
  } else {
    return rest;
  }
}

function mergeProfiles(
  base: NcrlJsonBuildProfileResolved,
  update: NcrlJsonBuildProfileResolved
): NcrlJsonBuildProfileResolved {
  const result = {
    ...base,
    ...update,
  };
  if (base.env && update.env) {
    result.env = {
      ...base.env,
      ...update.env,
    };
  }
  if (base.android && update.android) {
    result.android = mergeProfiles(
      base.android as NcrlJsonBuildProfileResolved,
      update.android as NcrlJsonBuildProfileResolved
    );
  }
  if (base.ios && update.ios) {
    result.ios = mergeProfiles(
      base.ios as NcrlJsonBuildProfileResolved,
      update.ios as NcrlJsonBuildProfileResolved
    );
  }
  return result;
}

function getDefaultProfile<T extends Platform>(platform: T): NcrlJsonBuildProfile {
  const defaultProfile = BuildProfileSchema.validate(
    {},
    { allowUnknown: false, abortEarly: false, convert: true }
  ).value;
  const { android, ios, ...base } = defaultProfile;
  return mergeProfiles(base, defaultProfile[platform]);
}
