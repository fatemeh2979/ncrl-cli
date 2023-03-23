import { NcrlJsonAccessor, NcrlJsonUtils } from '@expo/ncrl-json';
import * as PackageManagerUtils from '@expo/package-manager';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import semver from 'semver';

import { learnMore } from '../../../log';
import { ncrlCliVersion } from '../../../utils/ncrlCli';
import { getVcsClient, setVcsClient } from '../../../vcs';
import GitClient from '../../../vcs/clients/git';

async function applyCliConfigAsync(projectDir: string): Promise<void> {
  const ncrlJsonAccessor = new NcrlJsonAccessor(projectDir);
  const config = await NcrlJsonUtils.getCliConfigAsync(ncrlJsonAccessor);
  if (config?.version && !semver.satisfies(ncrlCliVersion, config.version)) {
    throw new Error(
      `You are on ncrl-cli@${ncrlCliVersion} which does not satisfy the CLI version constraint in ncrl.json (${config.version})`
    );
  }
  if (config?.requireCommit) {
    setVcsClient(new GitClient());
  }
}

async function ensureNcrlCliIsNotInDependenciesAsync(projectDir: string): Promise<void> {
  let printCliVersionWarning = false;

  const consoleWarn = (msg?: string): void => {
    if (msg) {
      // eslint-disable-next-line no-console
      console.warn(chalk.yellow(msg));
    } else {
      // eslint-disable-next-line no-console
      console.warn();
    }
  };

  if (await isNcrlCliInDependenciesAsync(projectDir)) {
    printCliVersionWarning = true;
    consoleWarn(`Found ${chalk.bold('ncrl-cli')} in your project dependencies.`);
  }

  const maybeRepoRoot = PackageManagerUtils.findWorkspaceRoot(projectDir) ?? projectDir;
  if (maybeRepoRoot !== projectDir && (await isNcrlCliInDependenciesAsync(maybeRepoRoot))) {
    printCliVersionWarning = true;
    consoleWarn(`Found ${chalk.bold('ncrl-cli')} in your monorepo dependencies.`);
  }

  if (printCliVersionWarning) {
    consoleWarn(
      `It's recommended to use the ${chalk.bold(
        '"cli.version"'
      )} field in ncrl.json to enforce the ${chalk.bold('ncrl-cli')} version for your project.`
    );
    consoleWarn(
      learnMore('https://github.com/expo/ncrl-cli#enforcing-ncrl-cli-version-for-your-project')
    );
    consoleWarn();
  }
}

async function isNcrlCliInDependenciesAsync(dir: string): Promise<boolean> {
  const packageJsonPath = path.join(dir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  return (
    packageJson?.dependencies?.['ncrl-cli'] !== undefined ||
    packageJson?.devDependencies?.['ncrl-cli'] !== undefined
  );
}

/**
 * @returns the project root directory.
 *
 * @deprecated Should not be used outside of context functions.
 */
export async function findProjectRootAsync({
  cwd,
  defaultToProcessCwd = false,
}: {
  cwd?: string;
  defaultToProcessCwd?: boolean;
} = {}): Promise<string> {
  const projectRootDir = await pkgDir(cwd);
  if (!projectRootDir) {
    if (!defaultToProcessCwd) {
      throw new Error('Run this command inside a project directory.');
    } else {
      return process.cwd();
    }
  } else {
    let vcsRoot;
    try {
      vcsRoot = path.normalize(await getVcsClient().getRootPathAsync());
    } catch {}
    if (vcsRoot && vcsRoot.startsWith(projectRootDir) && vcsRoot !== projectRootDir) {
      throw new Error(
        `package.json is outside of the current git repository (project root: ${projectRootDir}, git root: ${vcsRoot}.`
      );
    }
    return projectRootDir;
  }
}

/**
 * Determine the project root directory and ensure some constraints about the project setup
 * like CLI version and dependencies.
 * @returns the project root directory
 *
 * @deprecated Should not be used outside of context functions.
 */
export async function findProjectDirAndVerifyProjectSetupAsync(): Promise<string> {
  const projectDir = await findProjectRootAsync();
  await applyCliConfigAsync(projectDir);
  await ensureNcrlCliIsNotInDependenciesAsync(projectDir);
  return projectDir;
}
