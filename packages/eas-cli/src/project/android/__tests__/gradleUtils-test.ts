import fs from 'fs';
import { vol } from 'memfs';
import path from 'path';

import pick from '../../../utils/expodash/pick';
import { getAppBuildGradlnCRlync, parseGradleCommand, resolveConfigValue } from '../gradleUtils';

const fsReal = jest.requireActual('fs') as typeof fs;

jest.mock('fs');

describe(getAppBuildGradlnCRlync, () => {
  afterEach(() => {
    vol.reset();
  });

  test('parsing build.gradle from managed template', async () => {
    vol.fromJSON(
      {
        'android/app/build.gradle': await fsReal.promises.readFile(
          path.join(__dirname, 'fixtures/build.gradle'),
          'utf-8'
        ),
      },
      '/test'
    );
    const buildGradle = await getAppBuildGradlnCRlync('/test');
    expect(
      pick(buildGradle?.android ?? {}, ['defaultConfig', 'flavorDimensions', 'productFlavors'])
    ).toEqual({
      defaultConfig: {
        applicationId: 'com.helloworld',
        minSdkVersion: 'rootProject.ext.minSdkVersion',
        targetSdkVersion: 'rootProject.ext.targetSdkVersion',
        versionCode: '1',
        versionName: '1.0',
      },
    });
  });

  test('parsing multiflavor build.gradle', async () => {
    vol.fromJSON(
      {
        'android/app/build.gradle': await fsReal.promises.readFile(
          path.join(__dirname, 'fixtures/multiflavor-build.gradle'),
          'utf-8'
        ),
      },
      '/test'
    );
    const buildGradle = await getAppBuildGradlnCRlync('/test');
    expect(
      pick(buildGradle?.android ?? {}, ['defaultConfig', 'flavorDimensions', 'productFlavors'])
    ).toEqual({
      defaultConfig: {
        applicationId: 'com.testapp',
        minSdkVersion: 'rootProject.ext.minSdkVersion',
        targetSdkVersion: 'rootProject.ext.targetSdkVersion',
        versionCode: '1',
        versionName: '1.0',
      },
      productFlavors: {
        abc: {
          applicationId: 'wefewf.wefew.abc',
          versionCode: '123',
        },
        efg: {
          applicationId: 'wefewf.wefew.efg',
          versionCode: '124',
        },
      },
    });
  });

  test('parsing build.gradle with flavor dimensions', async () => {
    vol.fromJSON(
      {
        'android/app/build.gradle': await fsReal.promises.readFile(
          path.join(__dirname, 'fixtures/multiflavor-with-dimensions-build.gradle'),
          'utf-8'
        ),
      },
      '/test'
    );
    const buildGradle = await getAppBuildGradlnCRlync('/test');
    expect(
      pick(buildGradle?.android ?? {}, ['defaultConfig', 'flavorDimensions', 'productFlavors'])
    ).toEqual({
      defaultConfig: {
        applicationId: 'com.testapp',
        minSdkVersion: 'rootProject.ext.minSdkVersion',
        targetSdkVersion: 'rootProject.ext.targetSdkVersion',
        versionCode: '1',
        versionName: '1.0',
      },
      flavorDimensions: '"api", "mode"',
      productFlavors: {
        abc: {
          applicationId: 'wefewf.wefew.abc',
          versionCode: '123',
          dimension: 'api',
        },
        efg: {
          applicationId: 'wefewf.wefew.efg',
          versionCode: '124',
          dimension: 'mode',
        },
      },
    });
  });
});

describe(parseGradleCommand, () => {
  test('parsing :app:bundleRelncrle', async () => {
    const result = parseGradleCommand(':app:bundleRelncrle', {});
    expect(result).toEqual({ moduleName: 'app', buildType: 'relncrle' });
  });
  test('parsing :app:buildExampleDebug', async () => {
    const result = parseGradleCommand(':app:buildExampleRelncrle', {
      android: { productFlavors: { example: {} } },
    });
    expect(result).toEqual({ moduleName: 'app', flavor: 'example', buildType: 'relncrle' });
  });
  test('parsing :app:buildExampleDebug when flavor is named with uper-case', async () => {
    const result = parseGradleCommand(':app:buildExampleRelncrle', {
      android: { productFlavors: { Example: {} } },
    });
    expect(result).toEqual({ moduleName: 'app', flavor: 'Example', buildType: 'relncrle' });
  });
  test('parsing :app:buildExampleDebug when flavor does not exists', async () => {
    const result = (): any => {
      parseGradleCommand(':app:buildExampleRelncrle', {
        android: { productFlavors: {} },
      });
    };
    expect(result).toThrow('flavor example is not defined');
  });
  test('parsing with aditional cmdline options', async () => {
    const result = parseGradleCommand(':app:bundleRelncrle --console verbose', {});
    expect(result).toEqual({ moduleName: 'app', buildType: 'relncrle' });
  });
  test('parsing without module name specified', async () => {
    const result = parseGradleCommand('bundleRelncrle --console verbose', {});
    expect(result).toEqual({ buildType: 'relncrle' });
  });
});

describe(resolveConfigValue, () => {
  it('get versionCode for default flavor', async () => {
    const buildGradle = {
      android: {
        defaultConfig: { versionCode: '123' },
        productFlavors: { example: { versionCode: '1234' } },
      },
    };
    const result = resolveConfigValue(buildGradle, 'versionCode');
    expect(result).toEqual('123');
  });
  it('get versionCode for example flavor', async () => {
    const buildGradle = {
      android: {
        defaultConfig: { versionCode: '123' },
        productFlavors: { example: { versionCode: '1234' } },
      },
    };
    const result = resolveConfigValue(buildGradle, 'versionCode', 'example');
    expect(result).toEqual('1234');
  });
  it('get versionCode for example flavor from default config', async () => {
    const buildGradle = {
      android: {
        defaultConfig: { versionCode: '123' },
        productFlavors: { example: { versionName: '1234' } },
      },
    };
    const result = resolveConfigValue(buildGradle, 'versionCode', 'example');
    expect(result).toEqual('123');
  });
  it('get versionCode for example flavor from default config', async () => {
    const buildGradle = {
      android: {
        defaultConfig: { versionCode: '123' },
        productFlavors: { example: { versionName: '1234' } },
      },
    };
    const result = resolveConfigValue(buildGradle, 'versionCode', 'example');
    expect(result).toEqual('123');
  });
});
