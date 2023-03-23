import { Platform } from '@expo/ncrl-build-job';
import fs from 'fs-extra';
import { vol } from 'memfs';

import { NcrlJsonAccessor } from '../accessor';
import { InvalidNcrlJsonError } from '../errors';
import { NcrlJsonUtils } from '../utils';

jest.mock('fs');

beforeEach(async () => {
  vol.reset();
  await fs.mkdirp('/project');
});

test('minimal valid ncrl.json for both platforms', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {},
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const iosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production');
  const androidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'production'
  );

  expect(androidProfile).toEqual({
    distribution: 'store',
    credentialsSource: 'remote',
  });

  expect(iosProfile).toEqual({
    distribution: 'store',
    credentialsSource: 'remote',
  });
});

test('valid ncrl.json for development client builds', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {},
      debug: {
        developmentClient: true,
        android: {
          withoutCredentials: true,
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const iosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'debug');
  const androidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'debug'
  );
  expect(androidProfile).toEqual({
    credentialsSource: 'remote',
    distribution: 'store',
    developmentClient: true,
    withoutCredentials: true,
  });

  expect(iosProfile).toEqual({
    credentialsSource: 'remote',
    distribution: 'store',
    developmentClient: true,
  });
});

test(`valid ncrl.json with autoIncrement flag at build profile root`, async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        autoIncrement: true,
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const iosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production');
  const androidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'production'
  );
  expect(androidProfile).toEqual({
    autoIncrement: true,
    credentialsSource: 'remote',
    distribution: 'store',
  });

  expect(iosProfile).toEqual({
    autoIncrement: true,
    credentialsSource: 'remote',
    distribution: 'store',
  });
});

test('valid profile for internal distribution on Android', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      internal: {
        distribution: 'internal',
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const profile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'internal');
  expect(profile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',
  });
});

test('valid profile extending other profile', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      base: {
        node: '12.0.0',
      },
      extension: {
        extends: 'base',
        distribution: 'internal',
        node: '13.0.0',
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const baseProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'base');
  const extendedProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'extension'
  );
  expect(baseProfile).toEqual({
    distribution: 'store',
    credentialsSource: 'remote',
    node: '12.0.0',
  });
  expect(extendedProfile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',
    node: '13.0.0',
  });
});

test('valid profile extending other profile with platform specific envs', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      base: {
        env: {
          BASE_ENV: '1',
          PROFILE: 'base',
        },
      },
      extension: {
        extends: 'base',
        distribution: 'internal',
        env: {
          PROFILE: 'extension',
        },
        android: {
          env: {
            PROFILE: 'extension:android',
          },
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const baseProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'base');
  const extendedAndroidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'extension'
  );
  const extendedIosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.IOS,
    'extension'
  );
  expect(baseProfile).toEqual({
    distribution: 'store',
    credentialsSource: 'remote',
    env: {
      BASE_ENV: '1',
      PROFILE: 'base',
    },
  });
  expect(extendedAndroidProfile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',
    env: {
      BASE_ENV: '1',
      PROFILE: 'extension:android',
    },
  });
  expect(extendedIosProfile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',
    env: {
      BASE_ENV: '1',
      PROFILE: 'extension',
    },
  });
});

test('valid profile extending other profile with platform specific caching', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      base: {
        cache: {
          disabled: true,
        },
      },
      extension: {
        extends: 'base',
        distribution: 'internal',
        cache: {
          key: 'extend-key',
        },
        android: {
          cache: {
            cacheDefaultPaths: false,
            customPaths: ['somefakepath'],
          },
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const baseProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'base');
  const extendedAndroidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'extension'
  );
  const extendedIosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.IOS,
    'extension'
  );
  expect(baseProfile).toEqual({
    distribution: 'store',
    credentialsSource: 'remote',
    cache: {
      disabled: true,
    },
  });
  expect(extendedAndroidProfile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',
    cache: {
      cacheDefaultPaths: false,
      customPaths: ['somefakepath'],
    },
  });
  expect(extendedIosProfile).toEqual({
    distribution: 'internal',
    credentialsSource: 'remote',

    cache: {
      key: 'extend-key',
    },
  });
});

test('valid ncrl.json with missing profile', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {},
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const promise = NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'debug');
  await expect(promise).rejects.toThrowError('Missing build profile in ncrl.json: debug');
});

test('invalid ncrl.json when using wrong buildType', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: { android: { buildType: 'archive' } },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const promise = NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'production');
  await expect(promise).rejects.toThrowError(InvalidNcrlJsonError);
  await expect(promise).rejects.toThrowError(
    /.*ncrl\.json.* is not valid\.\r?\n- "build.production.android.buildType" must be one of \[apk, app-bundle\]$/g
  );
});

test('empty json', async () => {
  await fs.writeJson('/project/ncrl.json', {});

  const accessor = new NcrlJsonAccessor('/project');
  const promise = NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'production');
  await expect(promise).rejects.toThrowError('Missing build profile in ncrl.json: production');
});

test('invalid semver value', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: { node: 'alpha' },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const promise = NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'production');
  await expect(promise).rejects.toThrowError(InvalidNcrlJsonError);
  await expect(promise).rejects.toThrowError(
    /.*ncrl\.json.* is not valid\.\r?\n- "build.production.node" failed custom validation because alpha is not a valid version$/g
  );
});

test('invalid relncrle channel', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: { relncrleChannel: 'feature/myfeature' },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const promise = NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'production');
  await expect(promise).rejects.toThrowError(/fails to match the required pattern/);
});

test('get profile names', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: { node: '12.0.0-alpha' },
      blah: { node: '12.0.0' },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const allProfileNames = await NcrlJsonUtils.getBuildProfileNamesAsync(accessor);
  expect(allProfileNames.sort()).toEqual(['blah', 'production'].sort());
});

test('invalid resourceClass at build profile root', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        resourceClass: 'm1-experimental',
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');

  await expect(
    NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production')
  ).rejects.toThrowError(/build.production.resourceClass.*must be one of/);
});

test('iOS-specific resourceClass', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        ios: {
          resourceClass: 'm1-medium',
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  await expect(
    NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production')
  ).resolves.not.toThrow();
});

test('Android-specific resourceClass', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        android: {
          resourceClass: 'large',
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  await expect(
    NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.ANDROID, 'production')
  ).resolves.not.toThrow();
});

test('build profile with platform-specific custom build config', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        android: {
          config: 'production.android.yml',
        },
        ios: {
          config: 'production.ios.yml',
        },
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const androidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'production'
  );
  const iosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production');
  expect(androidProfile).toEqual({
    config: 'production.android.yml',
    distribution: 'store',
    credentialsSource: 'remote',
  });
  expect(iosProfile).toEqual({
    config: 'production.ios.yml',
    distribution: 'store',
    credentialsSource: 'remote',
  });
});

test('build profiles with both platform build config', async () => {
  await fs.writeJson('/project/ncrl.json', {
    build: {
      production: {
        config: 'production.yml',
      },
    },
  });

  const accessor = new NcrlJsonAccessor('/project');
  const androidProfile = await NcrlJsonUtils.getBuildProfilnCRlync(
    accessor,
    Platform.ANDROID,
    'production'
  );
  const iosProfile = await NcrlJsonUtils.getBuildProfilnCRlync(accessor, Platform.IOS, 'production');
  expect(androidProfile).toEqual({
    config: 'production.yml',
    distribution: 'store',
    credentialsSource: 'remote',
  });
  expect(iosProfile).toEqual({
    config: 'production.yml',
    distribution: 'store',
    credentialsSource: 'remote',
  });
});
