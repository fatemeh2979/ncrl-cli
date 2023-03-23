import { ExpoConfig } from '@expo/config';
import { AndroidConfig } from '@expo/config-plugins';
import { Platform, Workflow } from '@expo/ncrl-build-job';
import { AndroidVersionAutoIncrement } from '@expo/ncrl-json';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

import { ExpoGraphqlClient } from '../../commandUtils/context/contextUtils/createGraphqlClient';
import Log from '../../log';
import { isExpoUpdatesInstalled } from '../../project/projectUtils';
import { resolveWorkflowAsync } from '../../project/workflow';
import { syncUpdatesConfigurationAsync } from '../../update/android/UpdatesModule';
import { BumpStrategy, bumpVersionAsync, bumpVersionInAppJsonAsync } from './version';

export async function syncProjectConfigurationAsync(
  graphqlClient: ExpoGraphqlClient,
  {
    projectDir,
    exp,
    localAutoIncrement,
    projectId,
  }: {
    projectDir: string;
    exp: ExpoConfig;
    localAutoIncrement?: AndroidVersionAutoIncrement;
    projectId: string;
  }
): Promise<void> {
  const workflow = await resolveWorkflowAsync(projectDir, Platform.ANDROID);
  const versionBumpStrategy = resolveVersionBumpStrategy(localAutoIncrement ?? false);

  if (workflow === Workflow.GENERIC) {
    await cleanUpOldNcrlBuildGradleScriptAsync(projectDir);
    if (isExpoUpdatesInstalled(projectDir)) {
      await syncUpdatesConfigurationAsync(graphqlClient, projectDir, exp, projectId);
    }
    await bumpVersionAsync({ projectDir, exp, bumpStrategy: versionBumpStrategy });
  } else {
    await bumpVersionInAppJsonAsync({ projectDir, exp, bumpStrategy: versionBumpStrategy });
  }
}

function resolveVersionBumpStrategy(autoIncrement: AndroidVersionAutoIncrement): BumpStrategy {
  if (autoIncrement === true) {
    return BumpStrategy.VERSION_CODE;
  } else if (autoIncrement === false) {
    return BumpStrategy.NOOP;
  } else if (autoIncrement === 'versionCode') {
    return BumpStrategy.VERSION_CODE;
  } else {
    return BumpStrategy.APP_VERSION;
  }
}

// TODO: remove this after a few months
export async function cleanUpOldNcrlBuildGradleScriptAsync(projectDir: string): Promise<void> {
  const ncrlBuildGradlePath = path.join(projectDir, 'android', 'app', 'ncrl-build.gradle');
  if (await fs.pathExists(ncrlBuildGradlePath)) {
    Log.withTick(`Removing ${chalk.bold('ncrl-build.gradle')} as it's not longer necessary`);
    await fs.remove(ncrlBuildGradlePath);

    const buildGradlePath = AndroidConfig.Paths.getAppBuildGradleFilePath(projectDir);
    const buildGradleContents = await fs.readFile(buildGradlePath, 'utf-8');
    const buildGradleContentsWithoutApply = buildGradleContents.replace(
      /apply from: ["'].\/ncrl-build.gradle["']\n/,
      ''
    );
    if (buildGradleContentsWithoutApply !== buildGradleContents) {
      await fs.writeFile(buildGradlePath, buildGradleContentsWithoutApply);
    }
  }
}
