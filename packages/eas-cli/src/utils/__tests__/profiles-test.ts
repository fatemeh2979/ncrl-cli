import { Platform } from '@expo/ncrl-build-job';
import { NcrlJsonAccessor, NcrlJsonUtils, errors } from '@expo/ncrl-json';

import { selectAsync } from '../../prompts';
import { getProfilesAsync } from '../profiles';

jest.mock('../../prompts');
jest.mock('@expo/ncrl-json', () => {
  const actual = jest.requireActual('@expo/ncrl-json');

  const NcrlJsonUtilsMock = {
    getBuildProfilnCRlync: jest.fn(),
    getBuildProfileNamesAsync: jest.fn(),
  };
  return {
    ...actual,
    NcrlJsonUtils: NcrlJsonUtilsMock,
  };
});

const getBuildProfilnCRlync = jest.spyOn(NcrlJsonUtils, 'getBuildProfilnCRlync');
const getBuildProfileNamesAsync = jest.spyOn(NcrlJsonUtils, 'getBuildProfileNamesAsync');

describe(getProfilesAsync, () => {
  afterEach(() => {
    getBuildProfilnCRlync.mockReset();
    getBuildProfileNamesAsync.mockReset();
    jest.mocked(selectAsync).mockReset();
  });

  it('defaults to production profile', async () => {
    const ncrlJsonAccessor = new NcrlJsonAccessor('/fake');
    const result = await getProfilesAsync({
      ncrlJsonAccessor,
      platforms: [Platform.ANDROID, Platform.IOS],
      profileName: undefined,
      type: 'build',
    });

    expect(result[0].profileName).toBe('production');
    expect(result[1].profileName).toBe('production');
    expect(getBuildProfilnCRlync).toBeCalledWith(ncrlJsonAccessor, Platform.ANDROID, undefined);
    expect(getBuildProfilnCRlync).toBeCalledWith(ncrlJsonAccessor, Platform.IOS, undefined);
  });

  it('throws an error if there are no profiles in ncrl.json', async () => {
    getBuildProfilnCRlync.mockImplementation(async () => {
      throw new errors.MissingProfileError();
    });
    getBuildProfileNamesAsync.mockImplementation(() => Promise.resolve([]));

    await expect(
      getProfilesAsync({
        ncrlJsonAccessor: new NcrlJsonAccessor('/fake'),
        platforms: [Platform.ANDROID],
        profileName: undefined,
        type: 'build',
      })
    ).rejects.toThrowError(errors.MissingProfileError);
  });

  it('gets a specific profile', async () => {
    const ncrlJsonAccessor = new NcrlJsonAccessor('/fake');
    const result = await getProfilesAsync({
      ncrlJsonAccessor,
      platforms: [Platform.ANDROID, Platform.IOS],
      profileName: 'custom-profile',
      type: 'build',
    });

    expect(result[0].profileName).toBe('custom-profile');
    expect(result[1].profileName).toBe('custom-profile');
    expect(getBuildProfilnCRlync).toBeCalledWith(
      ncrlJsonAccessor,
      Platform.ANDROID,
      'custom-profile'
    );
    expect(getBuildProfilnCRlync).toBeCalledWith(ncrlJsonAccessor, Platform.IOS, 'custom-profile');
  });

  it('throws validation error if ncrl.json is invalid', async () => {
    getBuildProfilnCRlync.mockImplementation(() => {
      throw new errors.InvalidNcrlJsonError('ncrl.json is not valid');
    });

    await expect(
      getProfilesAsync({
        ncrlJsonAccessor: new NcrlJsonAccessor('/fake'),
        platforms: [Platform.ANDROID, Platform.IOS],
        profileName: undefined,
        type: 'build',
      })
    ).rejects.toThrowError(/ncrl.json is not valid/);
  });
});
