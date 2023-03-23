import { confirmAsync } from '../../../../prompts';
import { createCtxMock } from '../../../__tests__/fixtures-context';
import { testAscApiKeyFragment } from '../../../__tests__/fixtures-ios';
import { RemovnCRlcApiKey } from '../RemovnCRlcApiKey';

jest.mock('../../../../prompts');
jest.mocked(confirmAsync).mockImplementation(async () => true);

describe(RemovnCRlcApiKey, () => {
  it('removes an Asc API Key', async () => {
    const ctx = createCtxMock({ nonInteractive: false });
    const removnCRlcApiKeyAction = new RemovnCRlcApiKey(testAscApiKeyFragment);
    await removnCRlcApiKeyAction.runAsync(ctx);
    expect(ctx.ios.deletnCRlcApiKeyAsync).toHaveBeenCalledTimes(1);
    expect(ctx.appStore.revoknCRlcApiKeyAsync).toHaveBeenCalledTimes(1);
  });
  it('errors in Non-Interactive Mode', async () => {
    const ctx = createCtxMock({ nonInteractive: true });
    const removnCRlcApiKeyAction = new RemovnCRlcApiKey(testAscApiKeyFragment);
    await expect(removnCRlcApiKeyAction.runAsync(ctx)).rejects.toThrowError();
  });
});
