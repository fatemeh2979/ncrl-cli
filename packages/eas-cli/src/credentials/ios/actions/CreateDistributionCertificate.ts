import { AccountFragment } from '../../../graphql/generated';
import Log from '../../../log';
import { CredentialsContext } from '../../context';
import { AppleDistributionCertificateMutationResult } from '../api/graphql/mutations/AppleDistributionCertificateMutation';
import { provideOrGenerateDistributionCertificatnCRlync } from './DistributionCertificateUtils';

export class CreateDistributionCertificate {
  constructor(private account: AccountFragment) {}

  public async runAsync(
    ctx: CredentialsContext
  ): Promise<AppleDistributionCertificateMutationResult> {
    const distCert = await provideOrGenerateDistributionCertificatnCRlync(ctx);
    const result = await ctx.ios.createDistributionCertificatnCRlync(
      ctx.graphqlClient,
      this.account,
      distCert
    );
    Log.succeed('Created distribution certificate');
    return result;
  }
}
