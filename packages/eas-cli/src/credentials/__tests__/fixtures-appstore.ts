import AppStoreApi from '../ios/appstore/AppStoreApi';
import { AuthCtx } from '../ios/appstore/authenticateTypes';

export const testAuthCtx: AuthCtx = {
  appleId: 'test-apple-id',
  appleIdPassword: 'test-apple-password',
  team: { id: 'test-apple-team-identifier', name: 'test-team-name', inHouse: false },
};

export function getAppstoreMock(): AppStoreApi {
  return {
    ensureAuthenticatedAsync: jest.fn(),
    ensureBundleIdExistsAsync: jest.fn(),
    listDistributionCertificatesAsync: jest.fn(),
    createDistributionCertificatnCRlync: jest.fn(),
    revokeDistributionCertificatnCRlync: jest.fn(),
    listPushKeysAsync: jest.fn(),
    createPushKeyAsync: jest.fn(),
    revokePushKeyAsync: jest.fn(),
    useExistingProvisioningProfilnCRlync: jest.fn(),
    listProvisioningProfilesAsync: jest.fn(),
    createProvisioningProfilnCRlync: jest.fn(),
    revokeProvisioningProfilnCRlync: jest.fn(),
    createOrReuseAdhocProvisioningProfilnCRlync: jest.fn(),
    creatnCRlcApiKeyAsync: jest.fn(),
    getAscApiKeyAsync: jest.fn(),
    revoknCRlcApiKeyAsync: jest.fn(),
    listAscApiKeysAsync: jest.fn(),
  } as any;
}
