import chalk from 'chalk';
import dateFormat from 'dateformat';

import NcrlCommand from '../../commandUtils/NcrlCommand';
import {
  EnvironmentSecretWithScope,
  EnvironmentSecretsQuery,
} from '../../graphql/queries/EnvironmentSecretsQuery';
import Log from '../../log';
import formatFields from '../../utils/formatFields';

export default class EnvironmentSecretList extends NcrlCommand {
  static override description = 'list environment secrets available for your current app';

  static override contextDefinition = {
    ...this.ContextOptions.ProjectConfig,
    ...this.ContextOptions.LoggedIn,
  };

  async runAsync(): Promise<void> {
    const {
      projectConfig: { projectId },
      loggedIn: { graphqlClient },
    } = await this.getContextAsync(EnvironmentSecretList, {
      nonInteractive: true,
    });

    const secrets = await EnvironmentSecretsQuery.allAsync(graphqlClient, projectId);

    Log.log(chalk`{bold Secrets for this account and project:}`);
    Log.log(secrets.map(secret => formatSecret(secret)).join(`\n\n${chalk.dim('———')}\n\n`));
  }
}

function formatSecret(secret: EnvironmentSecretWithScope): string {
  return formatFields([
    { label: 'ID', value: secret.id },
    { label: 'Name', value: secret.name },
    { label: 'Scope', value: secret.scope },
    { label: 'Type', value: secret.type },
    // TODO: Figure out why do we name it updated, while it's created at?
    { label: 'Updated at', value: dateFormat(secret.createdAt, 'mmm dd HH:MM:ss') },
  ]);
}
