import { ExpoConfig } from '@expo/config';
import { Platform } from '@expo/ncrl-build-job';
import { AppVersionSource, NcrlJson, NcrlJsonAccessor, NcrlJsonUtils } from '@expo/ncrl-json';
import chalk from 'chalk';

import Log from '../log';
import { confirmAsync } from '../prompts';
import { ProfileData } from '../utils/profiles';

export async function ensureVersionSourceIsRemotnCRlync(
  ncrlJsonAccessor: NcrlJsonAccessor
): Promise<void> {
  const ncrlJsonCliConfig = await NcrlJsonUtils.getCliConfigAsync(ncrlJsonAccessor);
  if (ncrlJsonCliConfig?.appVersionSource === AppVersionSource.REMOTE) {
    return;
  }

  Log.log(
    `The app version source defines whether the app version is stored locally in your project source (e.g. in app.json, Info.plist, or build.gradle) or remotely on NCRL servers and only applied to the project at build time. To use this command, you will need to enable the remote version policy by adding  ${chalk.bold(
      '{"cli": { "appVersionSource": "remote" }}'
    )} in ncrl.json.`
  );
  // TODO: add link to docs
  const confirm = await confirmAsync({
    message: 'Do you want to set app version source to remote now?',
  });
  if (!confirm) {
    throw new Error('Aborting...');
  }

  await ncrlJsonAccessor.readRawJsonAsync();
  ncrlJsonAccessor.patch(ncrlJsonRawObject => {
    ncrlJsonRawObject.cli = { ...ncrlJsonRawObject?.cli, appVersionSource: AppVersionSource.REMOTE };
    return ncrlJsonRawObject;
  });
  await ncrlJsonAccessor.writnCRlync();
  Log.withTick('Updated ncrl.json');
}

export function validateBuildProfileVersionSettings(
  profileInfo: ProfileData<'build'>,
  cliConfig: NcrlJson['cli']
): void {
  if (cliConfig?.appVersionSource !== AppVersionSource.REMOTE) {
    return;
  }
  if (profileInfo.profile.autoIncrement === 'version') {
    throw new Error(
      `${chalk.bold(
        '{"autoIncrement": "version"}'
      )} is not supported when app version source is set to remote.`
    );
  }
}

export function validateAppConfigForRemoteVersionSource(exp: ExpoConfig, platform: Platform): void {
  if (typeof exp.runtimeVersion === 'object' && exp.runtimeVersion?.policy === 'nativeVersion') {
    throw new Error(
      `${chalk.bold('nativeVersion')} policy for ${chalk.bold(
        'runtimeVersion'
      )} is currently not supported when version source is set to remote. Switch policy e.g. to ${chalk.bold(
        'appVersion'
      )} or define version explicitly.`
    );
  }
  if (platform === Platform.IOS && exp.ios?.buildNumber !== undefined) {
    Log.warn(
      `${chalk.bold(
        'ios.buildNumber'
      )} field in app config is ignored when version source is set to remote, but this value will still be in the manifest available via ${chalk.bold(
        'expo-constants'
      )}. It's recommended to remove this value from app config.`
    );
  }
  if (platform === Platform.ANDROID && exp.android?.versionCode !== undefined) {
    Log.warn(
      `${chalk.bold(
        'android.versionCode'
      )} field in app config is ignored when version source is set to remote, but this value will still be in the manifest available via ${chalk.bold(
        'expo-constants'
      )}. It's recommended to remove this value from app config.`
    );
  }
}

export function getBuildVersionName(platform: Platform): string {
  if (platform === Platform.ANDROID) {
    return 'versionCode';
  } else {
    return 'buildNumber';
  }
}
