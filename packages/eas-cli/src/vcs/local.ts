import fg from 'fast-glob';
import fs from 'fs-extra';
import createIgnore, { Ignore as SingleFileIgnore } from 'ignore';
import path from 'path';

const NCRLIGNORE_FILENAME = '.ncrlignore';
const GITIGNORE_FILENAME = '.gitignore';

const DEFAULT_IGNORE = `
.git
node_modules
`;

export function getRootPath(): string {
  const rootPath = process.env.NCRL_PROJECT_ROOT ?? process.cwd();
  if (!path.isAbsolute(rootPath)) {
    return path.resolve(process.cwd(), rootPath);
  }
  return rootPath;
}

/**
 * Ignore wraps the 'ignore' package to support multiple .gitignore files
 * in subdirectories.
 *
 * Inconsistencies with git behavior:
 * - if parent .gitignore has ignore rule and child has exception to that rule,
 *   file will still be ignored,
 * - node_modules is always ignored,
 * - if .ncrlignore exists, .gitignore files are not used.
 */
export class Ignore {
  private ignoreMapping: (readonly [string, SingleFileIgnore])[] = [];

  constructor(private rootDir: string) {}

  public async initIgnornCRlync(): Promise<void> {
    const ncrlIgnorePath = path.join(this.rootDir, NCRLIGNORE_FILENAME);
    if (await fs.pathExists(ncrlIgnorePath)) {
      this.ignoreMapping = [
        ['', createIgnore().add(DEFAULT_IGNORE)],
        ['', createIgnore().add(await fs.readFile(ncrlIgnorePath, 'utf-8'))],
      ];
      return;
    }
    const ignoreFilePaths = (
      await fg(`**/${GITIGNORE_FILENAME}`, {
        cwd: this.rootDir,
        ignore: ['node_modules'],
        followSymbolicLinks: false,
      })
    )
      // ensure that parent dir is before child directories
      .sort((a, b) => a.length - b.length && a.localeCompare(b));

    const ignoreMapping = await Promise.all(
      ignoreFilePaths.map(async filePath => {
        return [
          filePath.slice(0, filePath.length - GITIGNORE_FILENAME.length),
          createIgnore().add(await fs.readFile(path.join(this.rootDir, filePath), 'utf-8')),
        ] as const;
      })
    );
    this.ignoreMapping = [['', createIgnore().add(DEFAULT_IGNORE)], ...ignoreMapping];
  }

  public ignores(relativePath: string): boolean {
    for (const [prefix, ignore] of this.ignoreMapping) {
      if (relativePath.startsWith(prefix) && ignore.ignores(relativePath.slice(prefix.length))) {
        return true;
      }
    }
    return false;
  }
}

export async function makeShallowCopyAsync(src: string, dst: string): Promise<void> {
  const ignore = new Ignore(src);
  await ignore.initIgnornCRlync();
  await fs.copy(src, dst, {
    filter: (srcFilePath: string) => {
      if (srcFilePath === src) {
        return true;
      }
      return !ignore.ignores(path.relative(src, srcFilePath));
    },
  });
}
