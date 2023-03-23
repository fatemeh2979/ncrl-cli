import { listAndRenderBranchesOnAppAsync } from '../../branch/queries';
import NcrlCommand from '../../commandUtils/NcrlCommand';
import { NcrlNonInteractiveAndJsonFlags } from '../../commandUtils/flags';
import { NcrlPaginatedQueryFlags, getPaginatedQueryOptions } from '../../commandUtils/pagination';
import { enableJsonOutput } from '../../utils/json';

export default class BranchList extends NcrlCommand {
  static override description = 'list all branches';

  static override flags = {
    ...NcrlPaginatedQueryFlags,
    ...NcrlNonInteractiveAndJsonFlags,
  };

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const { flags } = await this.parse(BranchList);
    const {
      projectConfig: { projectId },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(BranchList, {
      nonInteractive: flags['non-interactive'],
    });
    const paginatedQueryOptions = getPaginatedQueryOptions(flags);

    if (paginatedQueryOptions.json) {
      enableJsonOutput();
    }

    await listAndRenderBranchesOnAppAsync(graphqlClient, { projectId, paginatedQueryOptions });
  }
}
