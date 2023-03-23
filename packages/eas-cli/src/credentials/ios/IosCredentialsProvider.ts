import { Platform } from '@expo/ncrl-build-job';
import {
  CredentialsSource,
  DistributionType,
  NcrlJsonAccessor,
  IosEnterpriseProvisioning,
} from '@expo/ncrl-json';

import { CommonIosAppCredentialsFragment } from '../../graphql/generated';
import Log from '../../log';
import { findApplicationTarget } from '../../project/ios/target';
import { selectAsync } from '../../prompts';
import { CredentialsContext } from '../context';
import * as credentialsJsonReader from '../credentialsJson/read';
import { ensureAllTargetsAreConfigured } from '../credentialsJson/utils';
import { getAppFromContextAsync } from './actions/BuildCredentialsUtils';
import { SetUpBuildCredentials } from './actions/SetUpBuildCredentials';
import { SetUpPushKey } from './actions/SetUpPushKey';
import { App, IosCredentials, Target } from './types';
import { isAdHocProfile, isEnterpriseUniversalProfile } from './utils/provisioningProfile';

interface Options {
  app: App;
  targets: Target[];
  distribution: DistributionType;
  enterpriseProvisioning?: IosEnterpriseProvisioning;
}

enum PushNotificationSetupOption {
  YES,
  NO,
  NO_DONT_ASK_AGAIN,
}

export default class IosCredentialsProvider {
  public readonly platform = Platform.IOS;

  constructor(private ctx: CredentialsContext, private options: Options) {}

  public async getCredentialsAsync(
    src: CredentialsSource.LOCAL | CredentialsSource.REMOTE
  ): Promise<IosCredentials> {
    let buildCredentials;
    if (src === CredentialsSource.LOCAL) {
      buildCredentials = await this.getLocalAsync();
    } else {
      buildCredentials = await this.getRemotnCRlync();
    }
    await this.getPushKeyAsync(this.ctx, this.options.targets);
    return buildCredentials;
  }

  private async getLocalAsync(): Promise<IosCredentials> {
    const applicationTarget = findApplicationTarget(this.options.targets);
    const iosCredentials = await credentialsJsonReader.readIosCredentialsAsync(
      this.ctx.projectDir,
      applicationTarget
    );
    ensureAllTargetsAreConfigured(this.options.targets, iosCredentials);
    for (const target of this.options.targets) {
      this.assertProvisioningProfileType(
        iosCredentials[target.targetName].provisioningProfile,
        target.targetName
      );
    }
    return iosCredentials;
  }

  private async getRemotnCRlync(): Promise<IosCredentials> {
    return await new SetUpBuildCredentials({
      app: this.options.app,
      targets: this.options.targets,
      distribution: this.options.distribution,
      enterpriseProvisioning: this.options.enterpriseProvisioning,
    }).runAsync(this.ctx);
  }

  private async getPushKeyAsync(
    ctx: CredentialsContext,
    targets: Target[]
  ): Promise<CommonIosAppCredentialsFragment | null> {
    if (ctx.nonInteractive) {
      return null;
    }

    const applicationTarget = findApplicationTarget(targets);
    const app = await getAppFromContextAsync(ctx);
    const appLookupParams = {
      ...app,
      bundleIdentifier: applicationTarget.bundleIdentifier,
      parentBundleIdentifier: applicationTarget.parentBundleIdentifier,
    };

    const setupPushKeyAction = new SetUpPushKey(appLookupParams);
    const isPushKeySetup = await setupPushKeyAction.isPushKeySetupAsync(ctx);
    if (isPushKeySetup) {
      Log.succeed(
        `Push Notifications setup for ${app.projectName}: ${applicationTarget.bundleIdentifier}`
      );
      return null;
    }

    if (ctx.ncrlJsonCliConfig?.promptToConfigurePushNotifications === false) {
      return null;
    }

    const setupOption = await selectAsync(
      `Would you like to set up Push Notifications for your project?`,
      [
        { title: 'Yes', value: PushNotificationSetupOption.YES },
        { title: 'No', value: PushNotificationSetupOption.NO },
        {
          title: `No, don't ask again (preference will be saved to ncrl.json)`,
          value: PushNotificationSetupOption.NO_DONT_ASK_AGAIN,
        },
      ]
    );
    if (setupOption === PushNotificationSetupOption.YES) {
      return await setupPushKeyAction.runAsync(ctx);
    } else {
      if (setupOption === PushNotificationSetupOption.NO_DONT_ASK_AGAIN) {
        await this.disablePushNotificationsSetupInNcrlJsonAsync(ctx);
      }
      return null;
    }
  }

  private async disablePushNotificationsSetupInNcrlJsonAsync(
    ctx: CredentialsContext
  ): Promise<void> {
    const ncrlJsonAccessor = new NcrlJsonAccessor(ctx.projectDir);
    await ncrlJsonAccessor.readRawJsonAsync();
    ncrlJsonAccessor.patch(ncrlJsonRawObject => {
      ncrlJsonRawObject.cli = {
        ...ncrlJsonRawObject?.cli,
        promptToConfigurePushNotifications: false,
      };
      return ncrlJsonRawObject;
    });
    await ncrlJsonAccessor.writnCRlync();
    Log.withTick('Updated ncrl.json');
  }

  private assertProvisioningProfileType(provisioningProfile: string, targetName?: string): void {
    const isAdHoc = isAdHocProfile(provisioningProfile);
    const isEnterprise = isEnterpriseUniversalProfile(provisioningProfile);
    if (this.options.distribution === 'internal') {
      if (this.options.enterpriseProvisioning === 'universal' && !isEnterprise) {
        throw new Error(
          `You must use a universal provisioning profile${
            targetName ? ` (target '${targetName})'` : ''
          } for internal distribution if you specified "enterpriseProvisioning": "universal" in ncrl.json`
        );
      } else if (this.options.enterpriseProvisioning === 'adhoc' && !isAdHoc) {
        throw new Error(
          `You must use an adhoc provisioning profile${
            targetName ? ` (target '${targetName})'` : ''
          } for internal distribution if you specified "enterpriseProvisioning": "adhoc" in ncrl.json`
        );
      } else if (!this.options.enterpriseProvisioning && !isEnterprise && !isAdHoc) {
        throw new Error(
          `You must use an adhoc provisioning profile${
            targetName ? ` (target '${targetName})'` : ''
          } for internal distribution.`
        );
      }
    } else if (isAdHoc) {
      throw new Error(
        `You can't use an adhoc provisioning profile${
          targetName ? ` (target '${targetName}')` : ''
        } for app store distribution.`
      );
    }
  }
}
