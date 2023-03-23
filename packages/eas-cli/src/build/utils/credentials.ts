import { Platform } from '@expo/ncrl-build-job';
import { CredentialsSource } from '@expo/ncrl-json';
import chalk from 'chalk';

import Log from '../../log';
import { requestedPlatformDisplayNames } from '../../platform';

export function logCredentialsSource(
  credentialsSource: CredentialsSource,
  platform: Platform
): void {
  let message = `Using ${credentialsSource} ${requestedPlatformDisplayNames[platform]} credentials`;
  if (credentialsSource === CredentialsSource.LOCAL) {
    message += ` ${chalk.dim('(credentials.json)')}`;
  } else if (credentialsSource === CredentialsSource.REMOTE) {
    message += ` ${chalk.dim('(Expo server)')}`;
  }
  Log.succeed(message);
}
