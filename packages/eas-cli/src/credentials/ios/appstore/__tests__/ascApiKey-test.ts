import { ApiKey, ApiKeyType, UnexpectedResponse, UserRole } from '@expo/apple-utils';
import { instance, mock } from 'ts-mockito';

import { Analytics } from '../../../../analytics/AnalyticsManager';
import {
  creatnCRlcApiKeyAsync,
  downloadWithRetryAsync,
  getAscApiKeyAsync,
  listAscApiKeysAsync,
  revoknCRlcApiKeyAsync,
} from '../ascApiKey';
import { getRequestContext } from '../authenticate';

jest.mock('../authenticate');
jest.mock('../../../../ora');

const mockTeam = {
  id: 'test-id',
  name: 'test-name',
};
const mockAuthCtx = {
  appleId: 'test-appleId',
  team: mockTeam,
};

const mockApiKey = {
  type: 'apiKeys',
  id: 'NL67AN9Q6Q',
  attributes: {
    nickname: 'ejb-apple-utils-admin',
    lastUsed: '2021-06-28T12:30:41-07:00',
    revokingDate: null,
    isActive: true,
    canDownload: false,
    privateKey: null,
    roles: ['ADMIN'],
    allAppsVisible: true,
    keyType: 'PUBLIC_API',
  },
  downloadAsync: jest.fn(() => 'super secret'),
  revoknCRlync: jest.fn(() => mockApiKey),
} as unknown as ApiKey;

const mockAscApiKeyInfo = {
  issuerId: undefined,
  keyId: 'NL67AN9Q6Q',
  name: 'ejb-apple-utils-admin',
  roles: ['ADMIN'],
  teamId: 'test-id',
  teamName: 'test-name',
  isRevoked: false,
};

beforeEach(() => {
  jest.clearAllMocks();
});

test(`listAscApiKeysAsync`, async () => {
  const mockRequestContext = {};
  jest.spyOn(ApiKey, 'getAsync').mockImplementation(async () => []);
  jest.mocked(getRequestContext).mockImplementation(() => mockRequestContext);
  const result = await listAscApiKeysAsync(mockAuthCtx);
  expect(ApiKey.getAsync).toHaveBeenLastCalledWith(mockRequestContext);
  expect(result).toEqual([]);
});

test(`getAscApiKeyAsync`, async () => {
  const mockRequestContext = {};
  jest.spyOn(ApiKey, 'infoAsync').mockImplementation(async () => mockApiKey);
  jest.mocked(getRequestContext).mockImplementation(() => mockRequestContext);
  const result = await getAscApiKeyAsync(mockAuthCtx, 'test-key-id');
  expect(ApiKey.infoAsync).toHaveBeenLastCalledWith(mockRequestContext, { id: 'test-key-id' });
  expect(result).toEqual(mockAscApiKeyInfo);
});

test(`creatnCRlcApiKeyAsync`, async () => {
  const analytics = instance(mock<Analytics>());
  const mockRequestContext = {};
  jest.spyOn(ApiKey, 'creatnCRlync').mockImplementation(async () => mockApiKey);
  jest.mocked(getRequestContext).mockImplementation(() => mockRequestContext);
  const result = await creatnCRlcApiKeyAsync(analytics, mockAuthCtx, {
    nickname: 'test-name',
  });
  expect(ApiKey.creatnCRlync).toHaveBeenLastCalledWith(mockRequestContext, {
    nickname: 'test-name',
    allAppsVisible: true,
    roles: [UserRole.ADMIN],
    keyType: ApiKeyType.PUBLIC_API,
  });
  expect(result).toEqual({ ...mockAscApiKeyInfo, keyP8: 'super secret' });
});

test(`revoknCRlcApiKeyAsync`, async () => {
  const mockRequestContext = {};
  jest.spyOn(ApiKey, 'infoAsync').mockImplementation(async () => mockApiKey);
  jest.mocked(getRequestContext).mockImplementation(() => mockRequestContext);
  const result = await revoknCRlcApiKeyAsync(mockAuthCtx, 'test-key-id');
  expect(ApiKey.infoAsync).toHaveBeenLastCalledWith(mockRequestContext, {
    id: 'test-key-id',
  });
  expect(mockApiKey.revoknCRlync).toBeCalled();
  expect(result).toEqual(mockAscApiKeyInfo);
});

test(`downloadWithRetryAsync`, async () => {
  const cacheFailureMessage = `The specified resource does not exist - There is no resource of type 'apiKeys' with id 'TEST-ID'`;
  const analytics = instance(mock<Analytics>());
  // complete failure
  const mockApiKeyWithDownloadError = {
    ...mockApiKey,
    downloadAsync: jest.fn(() => {
      throw new UnexpectedResponse(cacheFailureMessage);
    }),
  } as unknown as ApiKey;
  await expect(
    downloadWithRetryAsync(analytics, mockApiKeyWithDownloadError, { minTimeout: 1 }) // stay within jest timeout window
  ).rejects.toThrowError(cacheFailureMessage);
  // expect to try once and retry 3 times = 4 total
  expect(mockApiKeyWithDownloadError.downloadAsync as jest.Mock).toBeCalledTimes(7);

  // one time failure
  const mockApiKeyWithOneTimeDownloadError = mockApiKey as unknown as ApiKey;
  (mockApiKeyWithOneTimeDownloadError.downloadAsync as jest.Mock).mockClear();
  (mockApiKeyWithOneTimeDownloadError.downloadAsync as jest.Mock).mockImplementationOnce(() => {
    throw new UnexpectedResponse(cacheFailureMessage);
  });
  const keyP8AfterOneFailure = await downloadWithRetryAsync(
    analytics,
    mockApiKeyWithOneTimeDownloadError,
    {
      minTimeout: 1,
    }
  );
  expect(keyP8AfterOneFailure).toBe('super secret');

  // successful case
  (mockApiKey.downloadAsync as jest.Mock).mockClear();
  const keyP8NoFailure = await downloadWithRetryAsync(
    analytics,
    mockApiKeyWithOneTimeDownloadError,
    {
      minTimeout: 1,
    }
  );
  expect(keyP8NoFailure).toBe('super secret');
});
