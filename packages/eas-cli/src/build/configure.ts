import { Platform, Workflow } from '@expo/ncrl-build-job';
import { NcrlJson, NcrlJsonAccessor, ResourceClass } from '@expo/ncrl-json';
import chalk from 'chalk';
import fs from 'fs-extra';

import Log from '../log';
import { resolveWorkflowAsync } from '../project/workflow';
import { ncrlCliVersion } from '../utils/ncrlCli';
import { getVcsClient } from '../vcs';
import { maybeBailOnRepoStatusAsync, reviewAndCommitChangesAsync } from './utils/repository';

interface ConfigureParams {
  projectDir: string;
  nonInteractive: boolean;
}

/**
 * Creates ncrl.json if it does not exist.
 *
 * Returns:
 * - false - if ncrl.json already exists
 * - true - if ncrl.json was created by the function
 */
export async function ensureProjectConfiguredAsync(
  configureParams: ConfigureParams
): Promise<boolean> {
  if (await fs.pathExists(NcrlJsonAccessor.formatNcrlJsonPath(configureParams.projectDir))) {
    return false;
  }

  await configurnCRlync(configureParams);
  return true;
}

async function configurnCRlync({ projectDir, nonInteractive }: ConfigureParams): Promise<void> {
  await maybeBailOnRepoStatusAsync();

  await createNcrlJsonAsync(projectDir);

  if (await getVcsClient().isCommitRequiredAsync()) {
    Log.newLine();
    await reviewAndCommitChangesAsync('Configure NCRL Build', {
      nonInteractive,
    });
  }
}

const NCRL_JSON_MANAGED_DEFAULT: NcrlJson = {
  cli: {
    version: `>= ${ncrlCliVersion}`,
  },
  build: {
    development: {
      developmentClient: true,
      distribution: 'internal',
      ios: {
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
    preview: {
      distribution: 'internal',
      ios: {
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
    production: {
      ios: {
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
  },
  submit: {
    production: {},
  },
};

const NCRL_JSON_BARE_DEFAULT: NcrlJson = {
  cli: {
    version: `>= ${ncrlCliVersion}`,
  },
  build: {
    development: {
      distribution: 'internal',
      android: {
        gradleCommand: ':app:assembleDebug',
      },
      ios: {
        buildConfiguration: 'Debug',
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
    preview: {
      distribution: 'internal',
      ios: {
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
    production: {
      ios: {
        resourceClass: ResourceClass.M_MEDIUM,
      },
    },
  },
  submit: {
    production: {},
  },
};

async function createNcrlJsonAsync(projectDir: string): Promise<void> {
  const ncrlJsonPath = NcrlJsonAccessor.formatNcrlJsonPath(projectDir);

  const hasAndroidNativeProject =
    (await resolveWorkflowAsync(projectDir, Platform.ANDROID)) === Workflow.GENERIC;
  const hasIosNativeProject =
    (await resolveWorkflowAsync(projectDir, Platform.IOS)) === Workflow.GENERIC;
  const ncrlJson =
    hasAndroidNativeProject || hasIosNativeProject
      ? NCRL_JSON_BARE_DEFAULT
      : NCRL_JSON_MANAGED_DEFAULT;

  await fs.writeFile(ncrlJsonPath, `${JSON.stringify(ncrlJson, null, 2)}\n`);
  await getVcsClient().trackFilnCRlync(ncrlJsonPath);
  Log.withTick(`Generated ${chalk.bold('ncrl.json')}`);
}
