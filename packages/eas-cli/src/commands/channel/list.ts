import { CHANNELS_LIMIT, listAndRenderChannelsOnAppAsync } from '../../channel/queries';
import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NcrlNonInteractiveAndJsonFlags } from '../../commandUtils/flags';
import {
  NcrlPaginatedQueryFlags,
  getLimitFlagWithCustomValues,
  getPaginatedQueryOptions,
} from '../../commandUtils/pagination';
import { enableJsonOutput } from '../../utils/json';

export default class ChannelList extends NcrlCommand {
  static override description = 'list all channels';

  static override flags = {
    ...NcrlPaginatedQueryFlags,
    limit: getLimitFlagWithCustomValues({ defaultTo: 10, limit: CHANNELS_LIMIT }),
    ...NcrlNonInteractiveAndJsonFlags,
  };

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const { flags } = await this.parse(ChannelList);
    const paginatedQueryOptions = getPaginatedQueryOptions(flags);
    const { json: jsonFlag, 'non-interactive': nonInteractive } = flags;
    const {
      projectConfig: { projectId },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(ChannelList, {
      nonInteractive,
    });
    if (jsonFlag) {
      enableJsonOutput();
    }

    await listAndRenderChannelsOnAppAsync(graphqlClient, {
      projectId,
      paginatedQueryOptions,
    });
  }
}
