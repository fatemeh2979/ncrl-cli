import chalk from 'chalk';

class NamedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = chalk.red(this.constructor.name);
  }
}

export class InvalidNcrlJsonError extends NamedError {}

export class MissingNcrlJsonError extends NamedError {}

export class MissingProfileError extends NamedError {}

export class MissingParentProfileError extends NamedError {}
