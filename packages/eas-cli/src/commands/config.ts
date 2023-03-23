import { getProjectConfigDescription } from '@expo/config';
import { Platform } from '@expo/ncrl-build-job';
import { NcrlJsonAccessor, NcrlJsonUtils } from '@expo/ncrl-json';
import { Flags } from '@oclif/core';
import chalk from 'chalk';

import NcrlCommand from '../commandUtils/NcrlCommand';
import { NcrlNonInteractiveAndJsonFlags } from '../commandUtils/flags';
import { toAppPlatform } from '../graphql/types/AppPlatform';
import Log from '../log';
import { appPlatformEmojis } from '../platform';
import { selectAsync } from '../prompts';
import { enableJsonOutput, printJsonOnlyOutput } from '../utils/json';

export default class Config extends NcrlCommand {
  static override description = 'display project configuration (app.json + ncrl.json)';

  static override flags = {
    platform: Flags.enum<Platform>({ char: 'p', options: [Platform.ANDROID, Platform.IOS] }),
    profile: Flags.string({
      char: 'e',
      description:
        'Name of the build profile from ncrl.json. Defaults to "production" if defined in ncrl.json.',
      helpValue: 'PROFILE_NAME',
    }),
    // This option is used only on NCRL Build worker to read build profile from ncrl.json.
    'ncrl-json-only': Flags.boolean({
      hidden: true,
    }),
    ...NcrlNonInteractiveAndJsonFlags,
  };

  static override contextDefinition = {
    ...this.ContextOptions.DynamicProjectConfig,
    ...this.ContextOptions.ProjectDir,
  };

  async runAsync(): Promise<void> {
    const { flags } = await this.parse(Config);
    if (flags.json) {
      enableJsonOutput();
    }
    const { platform: maybePlatform, profile: maybeProfile } = flags;
    const { getDynamicProjectConfigAsync, projectDir } = await this.getContextAsync(Config, {
      nonInteractive: false,
    });

    const accessor = new NcrlJsonAccessor(projectDir);
    const profileName =
      maybeProfile ??
      (await selectAsync(
        'Select build profile',
        (
          await NcrlJsonUtils.getBuildProfileNamesAsync(accessor)
        ).map(profileName => ({
          title: profileName,
          value: profileName,
        }))
      ));
    const platform =
      maybePlatform ??
      (await selectAsync('Select platform', [
        {
          title: 'Android',
          value: Platform.ANDROID,
        },
        {
          title: 'iOS',
          value: Platform.IOS,
        },
      ]));

    const profile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, platform, profileName);
    if (flags['ncrl-json-only']) {
      if (flags.json) {
        printJsonOnlyOutput({ buildProfile: profile });
      } else {
        const appPlatform = toAppPlatform(platform);
        const platformEmoji = appPlatformEmojis[appPlatform];
        Log.log(`${platformEmoji} ${chalk.bold(`Build profile "${profileName}"`)}`);
        Log.newLine();
        Log.log(JSON.stringify(profile, null, 2));
      }
    } else {
      const { exp: appConfig } = await getDynamicProjectConfigAsync({
        env: profile.env,
        isPublicConfig: true,
      });

      if (flags.json) {
        printJsonOnlyOutput({ buildProfile: profile, appConfig });
      } else {
        Log.addNewLineIfNone();
        Log.log(chalk.bold(getProjectConfigDescription(projectDir)));
        Log.newLine();
        Log.log(JSON.stringify(appConfig, null, 2));
        Log.newLine();
        Log.newLine();
        const appPlatform = toAppPlatform(platform);
        const platformEmoji = appPlatformEmojis[appPlatform];
        Log.log(`${platformEmoji} ${chalk.bold(`Build profile "${profileName}"`)}`);
        Log.newLine();
        Log.log(JSON.stringify(profile, null, 2));
      }
    }
  }
}
