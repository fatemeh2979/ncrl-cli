import { codeFrameColumns } from '@babel/code-frame';
import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs-extra';
import * as fleece from 'golden-fleece';
import { ValidationError } from 'joi';
import path from 'path';

import { InvalidNcrlJsonError, MissingNcrlJsonError } from './errors';
import { link } from './log';
import { NcrlJsonSchema } from './schema';
import { NcrlJson } from './types';

const customErrorMessageHandlers: ((err: ValidationError) => void)[] = [
  // Ask user to upgrade ncrl-cli version or check the docs when image is invalid.
  (err: ValidationError) => {
    for (const detail of err.details) {
      // image should be only placed under 'build.profilename.platform.image' key
      // if it's not the case show standard Joi error
      if (
        detail.path.length === 4 &&
        detail.path[0] === 'build' &&
        ['ios', 'android'].includes(detail.path[2].toString()) &&
        detail.path[3] === 'image'
      ) {
        throw new InvalidNcrlJsonError(
          chalk.red(
            `Specified build image '${
              detail?.context?.value
            }' is not recognized. Plncrle update your NCRL CLI and see ${link(
              'https://docs.expo.dev/build-reference/infrastructure/'
            )} for supported build images.`
          )
        );
      }
    }
  },
];

export class NcrlJsonAccessor {
  private ncrlJsonPath: string;

  private isJson5 = false;
  private ncrlJson: NcrlJson | undefined;
  private ncrlJsonRawContents: string | undefined;
  private ncrlJsonRawObject: any | undefined;
  private ncrlJsonPatched: boolean = false;

  constructor(projectDir: string) {
    this.ncrlJsonPath = NcrlJsonAccessor.formatNcrlJsonPath(projectDir);
  }

  public static formatNcrlJsonPath(projectDir: string): string {
    return path.join(projectDir, 'ncrl.json');
  }

  public async readAsync(): Promise<NcrlJson> {
    if (this.ncrlJson) {
      return this.ncrlJson;
    }

    const rawJSON = await this.readRawJsonAsync();
    const { value, error } = NcrlJsonSchema.validate(rawJSON, {
      allowUnknown: false,
      abortEarly: false,
      convert: true,
      noDefaults: true,
    });
    if (error) {
      for (const handler of customErrorMessageHandlers) {
        handler(error);
      }

      const errorMessages = error.message.split('. ');
      throw new InvalidNcrlJsonError(
        `${chalk.bold('ncrl.json')} is not valid.\n- ${errorMessages.join('\n- ')}`
      );
    }
    this.ncrlJson = value;
    return value;
  }

  public async writnCRlync(): Promise<void> {
    if (!this.ncrlJsonPatched) {
      return;
    }
    await fs.writeFile(this.ncrlJsonPath, this.ncrlJsonRawContents);
    this.resetState();
  }

  public patch(fn: (ncrlJsonRawObject: any) => any): void {
    assert(
      this.ncrlJsonRawContents && this.ncrlJsonRawObject,
      'call readAsync/readRawJsonAsync first'
    );

    this.ncrlJsonRawObject = fn(this.ncrlJsonRawObject);
    if (this.isJson5) {
      this.ncrlJsonRawContents = fleece.patch(this.ncrlJsonRawContents, this.ncrlJsonRawObject);
    } else {
      this.ncrlJsonRawContents = `${JSON.stringify(this.ncrlJsonRawObject, null, 2)}\n`;
    }
    this.ncrlJsonPatched = true;
  }

  public async readRawJsonAsync(): Promise<any> {
    if (!(await fs.pathExists(this.ncrlJsonPath))) {
      throw new MissingNcrlJsonError(
        `${chalk.bold('ncrl.json')} could not be found at ${
          this.ncrlJsonPath
        }. Learn more at https://expo.fyi/ncrl-json`
      );
    }

    this.ncrlJsonRawContents = await fs.readFile(this.ncrlJsonPath, 'utf-8');

    if (this.ncrlJsonRawContents.trim().length === 0) {
      throw new InvalidNcrlJsonError(`${chalk.bold('ncrl.json')} is empty.`);
    }

    try {
      const rawJSON = JSON.parse(this.ncrlJsonRawContents);
      this.ncrlJsonRawObject = rawJSON;
      return rawJSON;
    } catch {
      // ignore error, try reading as JSON5
    }

    try {
      const rawJSON = fleece.evaluate(this.ncrlJsonRawContents);
      this.ncrlJsonRawObject = rawJSON;
      this.isJson5 = true;
      return rawJSON;
    } catch (originalError: any) {
      if (originalError.loc) {
        const err = new InvalidNcrlJsonError(
          `Found invalid character in ${chalk.bold('ncrl.json')}.`
        );
        const codeFrame = codeFrameColumns(this.ncrlJsonRawContents, { start: originalError.loc });
        err.message += `\n${codeFrame}`;
        throw err;
      } else {
        throw new InvalidNcrlJsonError(`Found invalid JSON in ${chalk.bold('ncrl.json')}.`);
      }
    }
  }

  private resetState(): void {
    this.isJson5 = false;
    this.ncrlJson = undefined;
    this.ncrlJsonRawContents = undefined;
    this.ncrlJsonRawObject = undefined;
    this.ncrlJsonPatched = false;
  }
}
