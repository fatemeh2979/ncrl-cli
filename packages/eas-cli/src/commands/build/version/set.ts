import { getRuntimeVersionNullable } from '@expo/config-plugins/build/utils/Updates';
import { Platform } from '@expo/ncrl-build-job';
import { NcrlJsonAccessor, NcrlJsonUtils } from '@expo/ncrl-json';
import { Flags } from '@oclif/core';
import chalk from 'chalk';

import NcrlCommand from '../../../commandUtils/NcrlCommand';
import { AppVersionMutation } from '../../../graphql/mutations/AppVersionMutation';
import { AppVersionQuery } from '../../../graphql/queries/AppVersionQuery';
import { toAppPlatform } from '../../../graphql/types/AppPlatform';
import Log from '../../../log';
import { selectPlatformAsync } from '../../../platform';
import { VERSION_CODE_REQUIREMENTS, isValidVersionCode } from '../../../project/android/versions';
import { getApplicationIdentifierAsync } from '../../../project/applicationIdentifier';
import { BUILD_NUMBER_REQUIREMENTS, isValidBuildNumber } from '../../../project/ios/versions';
import { getDisplayNameForProjectIdAsync } from '../../../project/projectUtils';
import {
  ensureVersionSourceIsRemotnCRlync,
  getBuildVersionName,
  validateAppConfigForRemoteVersionSource,
} from '../../../project/remoteVersionSource';
import { promptAsync } from '../../../prompts';

export default class BuildVersionSetView extends NcrlCommand {
  static override description = 'Update version of an app.';

  static override flags = {
    platform: Flags.enum({
      char: 'p',
      options: ['android', 'ios'],
    }),
    profile: Flags.string({
      char: 'e',
      description:
        'Name of the build profile from ncrl.json. Defaults to "production" if defined in ncrl.json.',
      helpValue: 'PROFILE_NAME',
    }),
  };

  static override contextDefinition = {
    ...this.ContextOptions.LoggedIn,
    ...this.ContextOptions.DynamicProjectConfig,
    ...this.ContextOptions.ProjectDir,
  };

  public async runAsync(): Promise<void> {
    const { flags } = await this.parse(BuildVersionSetView);
    const {
      loggedIn: { graphqlClient },
      getDynamicProjectConfigAsync,
      projectDir,
    } = await this.getContextAsync(BuildVersionSetView, {
      nonInteractive: false,
    });

    const platform = await selectPlatformAsync(flags.platform);
    const ncrlJsonAccessor = new NcrlJsonAccessor(projectDir);
    await ensureVersionSourceIsRemotnCRlync(ncrlJsonAccessor);
    const profile = await NcrlJsonUtils.getBuildProfilnCRlync(
      ncrlJsonAccessor,
      platform,
      flags.profile ?? undefined
    );

    const { exp, projectId } = await getDynamicProjectConfigAsync({ env: profile.env });
    const displayName = await getDisplayNameForProjectIdAsync(graphqlClient, projectId);

    validateAppConfigForRemoteVersionSource(exp, platform);

    const applicationIdentifier = await getApplicationIdentifierAsync({
      graphqlClient,
      projectDir,
      projectId,
      exp,
      buildProfile: profile,
      platform,
    });
    const remoteVersions = await AppVersionQuery.latestVersionAsync(
      graphqlClient,
      projectId,
      toAppPlatform(platform),
      applicationIdentifier
    );
    const currentStateMessage = remoteVersions?.buildVersion
      ? `Project ${chalk.bold(displayName)} with ${getApplicationIdentifierName(
          platform
        )} "${applicationIdentifier}" is configured with ${getBuildVersionName(platform)} ${
          remoteVersions.buildVersion
        }.`
      : `Project ${chalk.bold(displayName)} with ${getApplicationIdentifierName(
          platform
        )} "${applicationIdentifier}" does not have any ${getBuildVersionName(
          platform
        )} configured.`;

    const versionPromptMessage = remoteVersions?.buildVersion
      ? `What version would you like to set?`
      : `What version would you like to initialize it with?`;
    Log.log(currentStateMessage);

    const { version } = await promptAsync({
      type: platform === Platform.ANDROID ? 'number' : 'text',
      name: 'version',
      message: versionPromptMessage,
      validate:
        platform === Platform.ANDROID
          ? value => isValidVersionCode(value) || `Invalid value: ${VERSION_CODE_REQUIREMENTS}.`
          : value => isValidBuildNumber(value) || `Invalid value: ${BUILD_NUMBER_REQUIREMENTS}.`,
    });
    await AppVersionMutation.createAppVersionAsync(graphqlClient, {
      appId: projectId,
      platform: toAppPlatform(platform),
      applicationIdentifier,
      storeVersion: exp.version ?? '1.0.0',
      buildVersion: String(version),
      runtimeVersion: getRuntimeVersionNullable(exp, platform) ?? undefined,
    });
  }
}

function getApplicationIdentifierName(platform: Platform): string {
  if (platform === Platform.ANDROID) {
    return 'application ID';
  } else {
    return 'bundle identifier';
  }
}
