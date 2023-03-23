import { Flags } from '@oclif/core';
import assert from 'assert';

import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NcrlNonInteractiveAndJsonFlags } from '../../commandUtils/flags';
import { NcrlPaginatedQueryFlags, getPaginatedQueryOptions } from '../../commandUtils/pagination';
import {
  listAndRenderAppleDevicesOnAppleTeamAsync,
  selectAppleTeamOnAccountAsync,
} from '../../devices/queries';
import { getOwnerAccountForProjectIdAsync } from '../../project/projectUtils';
import { enableJsonOutput } from '../../utils/json';

export default class BuildList extends NcrlCommand {
  static override description = 'list all registered devices for your account';

  static override flags = {
    'apple-team-id': Flags.string(),
    ...NcrlPaginatedQueryFlags,
    ...NcrlNonInteractiveAndJsonFlags,
  };

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const { flags } = await this.parse(BuildList);
    const paginatedQueryOptions = getPaginatedQueryOptions(flags);
    const {
      projectConfig: { projectId },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(BuildList, {
      nonInteractive: paginatedQueryOptions.nonInteractive,
    });
    let appleTeamIdentifier = flags['apple-team-id'];
    let appleTeamName;
    if (paginatedQueryOptions.json) {
      enableJsonOutput();
    }

    const account = await getOwnerAccountForProjectIdAsync(graphqlClient, projectId);

    // if they don't provide a team id, fetch devices on their account
    if (!appleTeamIdentifier) {
      const selectedAppleTeam = await selectAppleTeamOnAccountAsync(graphqlClient, {
        accountName: account.name,
        paginatedQueryOptions: {
          ...paginatedQueryOptions,
          offset: 0,
          limit: undefined,
        },
        selectionPromptTitle: 'What Apple team would you like to list devices for?',
      });
      appleTeamIdentifier = selectedAppleTeam.appleTeamIdentifier;
      appleTeamName = selectedAppleTeam.appleTeamName;
    }

    assert(appleTeamIdentifier, 'No team identifier is specified');
    await listAndRenderAppleDevicesOnAppleTeamAsync(graphqlClient, {
      accountName: account.name,
      appleTeam: {
        appleTeamIdentifier,
        appleTeamName,
      },
      paginatedQueryOptions,
    });
  }
}
