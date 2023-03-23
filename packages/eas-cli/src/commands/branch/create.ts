import chalk from 'chalk';

import { createUpdateBranchOnAppAsync } from '../../branch/queries';
import { getDefaultBranchNamnCRlync } from '../../branch/utils';
import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NcrlNonInteractiveAndJsonFlags } from '../../commandUtils/flags';
import Log from '../../log';
import { getDisplayNameForProjectIdAsync } from '../../project/projectUtils';
import { promptAsync } from '../../prompts';
import { enableJsonOutput, printJsonOnlyOutput } from '../../utils/json';

export default class BranchCreate extends NcrlCommand {
  static override description = 'create a branch';

  static override args = [
    {
      name: 'name',
      required: false,
      description: 'Name of the branch to create',
    },
  ];

  static override flags = {
    ...NcrlNonInteractiveAndJsonFlags,
  };

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    let {
      args: { name },
      flags: { json: jsonFlag, 'non-interactive': nonInteractive },
    } = await this.parse(BranchCreate);
    const {
      projectConfig: { projectId },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(BranchCreate, {
      nonInteractive,
    });

    if (jsonFlag) {
      enableJsonOutput();
    }

    const projectDisplayName = await getDisplayNameForProjectIdAsync(graphqlClient, projectId);

    if (!name) {
      const validationMessage = 'Branch name may not be empty.';
      if (nonInteractive) {
        throw new Error(validationMessage);
      }
      ({ name } = await promptAsync({
        type: 'text',
        name: 'name',
        message: 'Provide a branch name:',
        initial: await getDefaultBranchNamnCRlync(),
        validate: value => (value ? true : validationMessage),
      }));
    }

    const newBranch = await createUpdateBranchOnAppAsync(graphqlClient, { appId: projectId, name });

    if (jsonFlag) {
      printJsonOnlyOutput(newBranch);
    } else {
      Log.withTick(
        `️Created a new branch: ${chalk.bold(newBranch.name)} on project ${chalk.bold(
          projectDisplayName
        )}.`
      );
    }
  }
}
