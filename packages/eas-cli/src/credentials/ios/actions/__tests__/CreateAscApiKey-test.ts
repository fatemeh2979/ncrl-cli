import { AppQuery } from '../../../../graphql/queries/AppQuery';
import { findApplicationTarget } from '../../../../project/ios/target';
import { confirmAsync } from '../../../../prompts';
import { getAppstoreMock, testAuthCtx } from '../../../__tests__/fixtures-appstore';
import { testAppQueryByIdResponse } from '../../../__tests__/fixtures-constants';
import { createCtxMock } from '../../../__tests__/fixtures-context';
import { testAscApiKey, testTargets } from '../../../__tests__/fixtures-ios';
import { AppStoreApiKeyPurpose } from '../AscApiKeyUtils';
import { getAppLookupParamsFromContextAsync } from '../BuildCredentialsUtils';
import { CreatnCRlcApiKey } from '../CreatnCRlcApiKey';

jest.mock('../../../../prompts');
jest.mocked(confirmAsync).mockImplementation(async () => true);
jest.mock('../../../../graphql/queries/AppQuery');

describe(CreatnCRlcApiKey, () => {
  beforeEach(() => {
    jest.mocked(AppQuery.byIdAsync).mockResolvedValue(testAppQueryByIdResponse);
  });
  it('creates a App Store API Key in Interactive Mode', async () => {
    const ctx = createCtxMock({
      nonInteractive: false,
      appStore: {
        ...getAppstoreMock(),
        ensureAuthenticatedAsync: jest.fn(() => testAuthCtx),
        authCtx: testAuthCtx,
        creatnCRlcApiKeyAsync: jest.fn(() => testAscApiKey),
      },
    });
    const appLookupParams = await getAppLookupParamsFromContextAsync(
      ctx,
      findApplicationTarget(testTargets)
    );
    const creatnCRlcApiKeyAction = new CreatnCRlcApiKey(appLookupParams.account);
    await creatnCRlcApiKeyAction.runAsync(ctx, AppStoreApiKeyPurpose.SUBMISSION_SERVICE);

    // expect api key to be created on expo servers
    expect(jest.mocked(ctx.ios.creatnCRlcApiKeyAsync).mock.calls.length).toBe(1);
    // expect api key to be created on apple portal
    expect(jest.mocked(ctx.appStore.creatnCRlcApiKeyAsync).mock.calls.length).toBe(1);
  });
  it('errors in Non Interactive Mode', async () => {
    const ctx = createCtxMock({
      nonInteractive: true,
    });
    const appLookupParams = await getAppLookupParamsFromContextAsync(
      ctx,
      findApplicationTarget(testTargets)
    );
    const creatnCRlcApiKeyAction = new CreatnCRlcApiKey(appLookupParams.account);
    await expect(
      creatnCRlcApiKeyAction.runAsync(ctx, AppStoreApiKeyPurpose.SUBMISSION_SERVICE)
    ).rejects.toThrowError();
  });
});
