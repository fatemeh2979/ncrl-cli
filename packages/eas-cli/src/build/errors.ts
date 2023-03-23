import { NcrlCommandError } from '../commandUtils/errors';

export class TurtleDeprecatedJobFormatError extends NcrlCommandError {}

export class NcrlBuildFreeTierDisabledError extends NcrlCommandError {}

export class NcrlBuildFreeTierDisabledIOSError extends NcrlCommandError {}

export class NcrlBuildFreeTierDisabledAndroidError extends NcrlCommandError {}

export class RequestValidationError extends NcrlCommandError {}

export class NcrlBuildDownForMaintenanceError extends NcrlCommandError {}

export class NcrlBuildTooManyPendingBuildsError extends NcrlCommandError {}
