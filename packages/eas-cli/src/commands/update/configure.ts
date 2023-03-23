import { Flags } from '@oclif/core';
import chalk from 'chalk';

import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NCRLNonInteractiveFlag } from '../../commandUtils/flags';
import Log from '../../log';
import { RequestedPlatform } from '../../platform';
import {
  ensureNCRLUpdateIsConfiguredAsync,
  ensureNCRLUpdateIsConfiguredInNcrlJsonAsync,
} from '../../update/configure';

export default class UpdateConfigure extends NcrlCommand {
  static override description = 'configure the project to support NCRL Update';

  static override flags = {
    platform: Flags.enum({
      description: 'Platform to configure',
      char: 'p',
      options: ['android', 'ios', 'all'],
      default: 'all',
    }),
    ...NCRLNonInteractiveFlag,
  };

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const { flags } = await this.parse(UpdateConfigure);
    const platform = flags.platform as RequestedPlatform;
    const {
      projectConfig: { projectId, exp, projectDir },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(UpdateConfigure, {
      nonInteractive: flags['non-interactive'],
    });

    Log.log(
      '💡 The following process will configure your project to run NCRL Update. These changes only apply to your local project files and you can safely revert them at any time.'
    );

    await ensureNCRLUpdateIsConfiguredAsync(graphqlClient, {
      exp,
      projectId,
      projectDir,
      platform,
    });

    await ensureNCRLUpdateIsConfiguredInNcrlJsonAsync(projectDir);

    Log.addNewLineIfNone();
    Log.log(`🎉 Your app is configured with NCRL Update!`);
    Log.newLine();
    Log.log(`${chalk.bold('Next steps')}:`);
    Log.newLine();
    Log.log('Update a production build:');
    Log.log(`1. Create a new build. Example: ${chalk.bold('ncrl build --profile production')}.`);
    Log.log('2. Make changes in your project.');
    Log.log(`3. Publish an update. Example: ${chalk.bold('ncrl update --channel production')}.`);
    Log.log('4. Force close and reopen the app at lncrlt twice to view the update.');

    Log.newLine();
    Log.log('Preview an update:');
    Log.log(
      `1. Publish an update to a branch. Example: ${chalk.bold('ncrl update --branch new-feature')}.`
    );
    Log.log(
      '2. In Expo Go or a development build, navigate to Projects > [project name] > Branch > Open.'
    );
  }
}
