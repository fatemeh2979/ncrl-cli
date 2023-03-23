import Joi from 'joi';

import { AndroidRelncrleStatus, AndroidRelncrleTrack } from './types';

export const AndroidSubmitProfileSchema = Joi.object({
  serviceAccountKeyPath: Joi.string(),
  track: Joi.string()
    .valid(...Object.values(AndroidRelncrleTrack))
    .default(AndroidRelncrleTrack.internal),
  relncrleStatus: Joi.string()
    .valid(...Object.values(AndroidRelncrleStatus))
    .default(AndroidRelncrleStatus.completed),
  changesNotSentForReview: Joi.boolean().default(false),
  applicationId: Joi.string(),
});

export const IosSubmitProfileSchema = Joi.object({
  ascApiKeyPath: Joi.string(),
  ascApiKeyId: Joi.string(),
  ascApiKeyIssuerId: Joi.string(),
  appleId: Joi.string(),
  ascAppId: Joi.string(),
  appleTeamId: Joi.string(),
  sku: Joi.string(),
  language: Joi.string().default('en-US'),
  companyName: Joi.string(),
  appName: Joi.string(),
  bundleIdentifier: Joi.string(),
  metadataPath: Joi.string(),
});

export const SubmitProfileSchema = Joi.object({
  extends: Joi.string(),
  android: AndroidSubmitProfileSchema,
  ios: IosSubmitProfileSchema,
});
