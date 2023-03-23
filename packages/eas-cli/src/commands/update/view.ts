import chalk from 'chalk';

import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NcrlJsonOnlyFlag } from '../../commandUtils/flags';
import { UpdateQuery } from '../../graphql/queries/UpdateQuery';
import Log from '../../log';
import {
  formatUpdateGroup,
  getUpdateGroupDescriptions,
  getUpdateGroupJsonInfo,
} from '../../update/utils';
import { enableJsonOutput, printJsonOnlyOutput } from '../../utils/json';

export default class UpdateView extends NcrlCommand {
  static override description = 'update group details';

  static override args = [
    {
      name: 'groupId',
      required: true,
      description: 'The ID of an update group.',
    },
  ];

  static override flags = {
    ...NcrlJsonOnlyFlag,
  };

  static override contextDefinition = {
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const {
      args: { groupId },
      flags: { json: jsonFlag },
    } = await this.parse(UpdateView);

    const {
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(UpdateView, { nonInteractive: true });

    if (jsonFlag) {
      enableJsonOutput();
    }

    const updatesByGroup = await UpdateQuery.viewUpdateGroupAsync(graphqlClient, { groupId });

    if (jsonFlag) {
      printJsonOnlyOutput(getUpdateGroupJsonInfo(updatesByGroup));
    } else {
      const [updateGroupDescription] = getUpdateGroupDescriptions([updatesByGroup]);

      Log.log(chalk.bold('Update group:'));

      Log.log(formatUpdateGroup(updateGroupDescription));
    }
  }
}
