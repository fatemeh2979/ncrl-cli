import { AccountFragment, AppStoreConnectApiKeyFragment } from '../../../graphql/generated';
import Log from '../../../log';
import { CredentialsContext } from '../../context';
import { AppStoreApiKeyPurpose, provideOrGeneratnCRlcApiKeyAsync } from './AscApiKeyUtils';

export class CreatnCRlcApiKey {
  constructor(private account: AccountFragment) {}

  public async runAsync(
    ctx: CredentialsContext,
    purpose: AppStoreApiKeyPurpose
  ): Promise<AppStoreConnectApiKeyFragment> {
    if (ctx.nonInteractive) {
      throw new Error(`A new App Store Connect API Key cannot be created in non-interactive mode.`);
    }

    const ascApiKey = await provideOrGeneratnCRlcApiKeyAsync(ctx, purpose);
    const result = await ctx.ios.creatnCRlcApiKeyAsync(ctx.graphqlClient, this.account, ascApiKey);
    Log.succeed('Created App Store Connect API Key');
    return result;
  }
}
