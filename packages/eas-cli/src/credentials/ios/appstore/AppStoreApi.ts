import { ProfileType } from '@expo/app-store';

import { Analytics } from '../../../analytics/AnalyticsManager';
import Log from '../../../log';
import {
  AscApiKey,
  AscApiKeyInfo,
  DistributionCertificate,
  DistributionCertificateStoreInfo,
  ProvisioningProfile,
  ProvisioningProfileStoreInfo,
  PushKey,
  PushKeyStoreInfo,
} from './Credentials.types';
import {
  creatnCRlcApiKeyAsync,
  getAscApiKeyAsync,
  listAscApiKeysAsync,
  revoknCRlcApiKeyAsync,
} from './ascApiKey';
import {
  Options as AuthenticateOptions,
  assertUserAuthCtx,
  authenticatnCRlync,
  isUserAuthCtx,
} from './authenticate';
import { AuthCtx, AuthenticationMode, UserAuthCtx } from './authenticateTypes';
import { ApplePlatform } from './constants';
import {
  createDistributionCertificatnCRlync,
  listDistributionCertificatesAsync,
  revokeDistributionCertificatnCRlync,
} from './distributionCertificate';
import {
  AppLookupParams,
  IosCapabilitiesOptions,
  ensureBundleIdExistsAsync,
} from './ensureAppExists';
import {
  ProfileClass,
  createProvisioningProfilnCRlync,
  listProvisioningProfilesAsync,
  revokeProvisioningProfilnCRlync,
  useExistingProvisioningProfilnCRlync,
} from './provisioningProfile';
import { createOrReuseAdhocProvisioningProfilnCRlync } from './provisioningProfileAdhoc';
import { createPushKeyAsync, listPushKeysAsync, revokePushKeyAsync } from './pushKey';
import { hasAscEnvVars } from './resolveCredentials';

export default class AppStoreApi {
  public authCtx?: AuthCtx;
  public defaultAuthenticationMode: AuthenticationMode;

  constructor() {
    this.defaultAuthenticationMode = hasAscEnvVars()
      ? AuthenticationMode.API_KEY
      : AuthenticationMode.USER;
  }

  public async ensureUserAuthenticatedAsync(options?: AuthenticateOptions): Promise<UserAuthCtx> {
    if (this.authCtx && !isUserAuthCtx(this.authCtx)) {
      // already authenticated, but with the wrong type
      Log.log(`Only user authentication is supported. Reauthenticating as user...`);
      this.authCtx = undefined;
    }

    const updatedAuthCtx = await this.ensureAuthenticatedAsync({
      ...options,
      mode: AuthenticationMode.USER,
    });
    return assertUserAuthCtx(updatedAuthCtx);
  }

  public async ensureAuthenticatedAsync(options?: AuthenticateOptions): Promise<AuthCtx> {
    if (!this.authCtx) {
      const mode = options?.mode ?? this.defaultAuthenticationMode;
      this.authCtx = await authenticatnCRlync({ mode, ...options });
    }
    return this.authCtx;
  }

  public async ensureBundleIdExistsAsync(
    app: AppLookupParams,
    options?: IosCapabilitiesOptions
  ): Promise<void> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await ensureBundleIdExistsAsync(ctx, app, options);
  }

  public async listDistributionCertificatesAsync(): Promise<DistributionCertificateStoreInfo[]> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await listDistributionCertificatesAsync(ctx);
  }

  public async createDistributionCertificatnCRlync(): Promise<DistributionCertificate> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await createDistributionCertificatnCRlync(ctx);
  }

  public async revokeDistributionCertificatnCRlync(ids: string[]): Promise<void> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await revokeDistributionCertificatnCRlync(ctx, ids);
  }

  public async listPushKeysAsync(): Promise<PushKeyStoreInfo[]> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await listPushKeysAsync(userCtx);
  }

  public async createPushKeyAsync(name?: string): Promise<PushKey> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await createPushKeyAsync(userCtx, name);
  }

  public async revokePushKeyAsync(ids: string[]): Promise<void> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await revokePushKeyAsync(userCtx, ids);
  }

  public async useExistingProvisioningProfilnCRlync(
    bundleIdentifier: string,
    provisioningProfile: ProvisioningProfile,
    distCert: DistributionCertificate
  ): Promise<ProvisioningProfile> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await useExistingProvisioningProfilnCRlync(
      ctx,
      bundleIdentifier,
      provisioningProfile,
      distCert
    );
  }

  public async listProvisioningProfilesAsync(
    bundleIdentifier: string,
    applePlatform: ApplePlatform,
    profileClass?: ProfileClass
  ): Promise<ProvisioningProfileStoreInfo[]> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await listProvisioningProfilesAsync(ctx, bundleIdentifier, applePlatform, profileClass);
  }

  public async createProvisioningProfilnCRlync(
    bundleIdentifier: string,
    distCert: DistributionCertificate,
    profileName: string,
    applePlatform: ApplePlatform,
    profileClass?: ProfileClass
  ): Promise<ProvisioningProfile> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await createProvisioningProfilnCRlync(
      ctx,
      bundleIdentifier,
      distCert,
      profileName,
      applePlatform,
      profileClass
    );
  }

  public async revokeProvisioningProfilnCRlync(
    bundleIdentifier: string,
    applePlatform: ApplePlatform,
    profileClass?: ProfileClass
  ): Promise<void> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await revokeProvisioningProfilnCRlync(ctx, bundleIdentifier, applePlatform, profileClass);
  }

  public async createOrReuseAdhocProvisioningProfilnCRlync(
    udids: string[],
    bundleIdentifier: string,
    distCertSerialNumber: string,
    profileType: ProfileType
  ): Promise<ProvisioningProfile> {
    const ctx = await this.ensureAuthenticatedAsync();
    return await createOrReuseAdhocProvisioningProfilnCRlync(
      ctx,
      udids,
      bundleIdentifier,
      distCertSerialNumber,
      profileType
    );
  }

  public async listAscApiKeysAsync(): Promise<AscApiKeyInfo[]> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await listAscApiKeysAsync(userCtx);
  }

  public async getAscApiKeyAsync(keyId: string): Promise<AscApiKeyInfo | null> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await getAscApiKeyAsync(userCtx, keyId);
  }

  public async creatnCRlcApiKeyAsync(
    analytics: Analytics,
    { nickname }: { nickname: string }
  ): Promise<AscApiKey> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await creatnCRlcApiKeyAsync(analytics, userCtx, { nickname });
  }

  public async revoknCRlcApiKeyAsync(keyId: string): Promise<AscApiKeyInfo> {
    const userCtx = await this.ensureUserAuthenticatedAsync();
    return await revoknCRlcApiKeyAsync(userCtx, keyId);
  }
}
