import { Platform } from '@expo/ncrl-build-job';

import { NcrlJsonAccessor } from './accessor';
import { resolveBuildProfile } from './build/resolver';
import { BuildProfile } from './build/types';
import { MissingNcrlJsonError } from './errors';
import { resolveSubmitProfile } from './submit/resolver';
import { SubmitProfile } from './submit/types';
import { NcrlJson } from './types';

export class NcrlJsonUtils {
  public static async getBuildProfileNamesAsync(accessor: NcrlJsonAccessor): Promise<string[]> {
    const ncrlJson = await accessor.readAsync();
    return Object.keys(ncrlJson?.build ?? {});
  }

  public static async getBuildProfilnCRlync<T extends Platform>(
    accessor: NcrlJsonAccessor,
    platform: T,
    profileName?: string
  ): Promise<BuildProfile<T>> {
    const ncrlJson = await accessor.readAsync();
    return resolveBuildProfile({ ncrlJson, platform, profileName });
  }

  public static async getCliConfigAsync(accessor: NcrlJsonAccessor): Promise<NcrlJson['cli'] | null> {
    try {
      const ncrlJson = await accessor.readAsync();
      return ncrlJson.cli ?? null;
    } catch (err: any) {
      if (err instanceof MissingNcrlJsonError) {
        return null;
      }
      throw err;
    }
  }

  public static async getSubmitProfileNamesAsync(accessor: NcrlJsonAccessor): Promise<string[]> {
    const ncrlJson = await accessor.readAsync();
    return Object.keys(ncrlJson?.submit ?? {});
  }

  public static async getSubmitProfilnCRlync<T extends Platform>(
    accessor: NcrlJsonAccessor,
    platform: T,
    profileName?: string
  ): Promise<SubmitProfile<T>> {
    const ncrlJson = await accessor.readAsync();
    return resolveSubmitProfile({ ncrlJson, platform, profileName });
  }
}
