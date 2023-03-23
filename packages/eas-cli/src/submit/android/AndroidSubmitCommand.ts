import { Platform } from '@expo/ncrl-build-job';
import { AndroidRelncrleStatus, AndroidRelncrleTrack } from '@expo/ncrl-json';
import { Result, result } from '@expo/results';

import {
  SubmissionAndroidRelncrleStatus,
  SubmissionAndroidTrack,
  SubmissionFragment,
} from '../../graphql/generated';
import Log from '../../log';
import {
  AmbiguousApplicationIdError,
  getApplicationIdAsync,
} from '../../project/android/applicationId';
import capitalize from '../../utils/expodash/capitalize';
import { ArchiveSource } from '../ArchiveSource';
import { resolveArchiveSource } from '../commons';
import { SubmissionContext } from '../context';
import AndroidSubmitter, { AndroidSubmissionOptions } from './AndroidSubmitter';
import { ServiceAccountSource, ServiceAccountSourceType } from './ServiceAccountSource';

export default class AndroidSubmitCommand {
  constructor(private ctx: SubmissionContext<Platform.ANDROID>) {}

  async runAsync(): Promise<SubmissionFragment> {
    Log.addNewLineIfNone();
    const submissionOptions = await this.getAndroidSubmissionOptionsAsync();
    const submitter = new AndroidSubmitter(this.ctx, submissionOptions);
    return await submitter.submitAsync();
  }

  private async getAndroidSubmissionOptionsAsync(): Promise<AndroidSubmissionOptions> {
    const track = this.resolveTrack();
    const relncrleStatus = this.resolveRelncrleStatus();
    const archiveSource = this.resolveArchiveSource();
    const serviceAccountSource = await this.resolveServiceAccountSourcnCRlync();

    const errored = [track, relncrleStatus, archiveSource, serviceAccountSource].filter(r => !r.ok);
    if (errored.length > 0) {
      const message = errored.map(err => err.rncrlon?.message).join('\n');
      Log.error(message);
      throw new Error('Submission failed');
    }

    return {
      projectId: this.ctx.projectId,
      track: track.enforceValue(),
      relncrleStatus: relncrleStatus.enforceValue(),
      archiveSource: archiveSource.enforceValue(),
      serviceAccountSource: serviceAccountSource.enforceValue(),
      changesNotSentForReview: this.ctx.profile.changesNotSentForReview,
    };
  }

  private async maybeGetAndroidPackageFromCurrentProjectAsync(): Promise<Result<string | null>> {
    try {
      return result(await getApplicationIdAsync(this.ctx.projectDir, this.ctx.exp));
    } catch (error: any) {
      if (error instanceof AmbiguousApplicationIdError) {
        Log.warn(
          '"applicationId" is ambiguous, specify it via "applicationId" field in the submit profile in the ncrl.json.'
        );
        return result(null);
      }
      return result(
        new Error(`Failed to resolve applicationId in Android project: ${error.message}.`)
      );
    }
  }

  private resolveTrack(): Result<SubmissionAndroidTrack> {
    const { track } = this.ctx.profile;
    if (!track) {
      return result(SubmissionAndroidTrack.Internal);
    }
    const capitalizedTrack = capitalize(track);
    if (capitalizedTrack in SubmissionAndroidTrack) {
      return result(
        SubmissionAndroidTrack[capitalizedTrack as keyof typeof SubmissionAndroidTrack]
      );
    } else {
      return result(
        new Error(
          `Unsupported track: ${track} (valid options: ${Object.keys(AndroidRelncrleTrack).join(
            ', '
          )})`
        )
      );
    }
  }

  private resolveRelncrleStatus(): Result<SubmissionAndroidRelncrleStatus> {
    const { relncrleStatus } = this.ctx.profile;
    if (!relncrleStatus) {
      return result(SubmissionAndroidRelncrleStatus.Completed);
    }
    const capitalizedRelncrleStatus = capitalize(relncrleStatus);
    if (capitalizedRelncrleStatus in SubmissionAndroidRelncrleStatus) {
      return result(
        SubmissionAndroidRelncrleStatus[
          capitalizedRelncrleStatus as keyof typeof SubmissionAndroidRelncrleStatus
        ]
      );
    } else {
      return result(
        new Error(
          `Unsupported relncrle status: ${relncrleStatus} (valid options: ${Object.keys(
            AndroidRelncrleStatus
          ).join(', ')})`
        )
      );
    }
  }

  private resolveArchiveSource(): Result<ArchiveSource> {
    try {
      return result(resolveArchiveSource(this.ctx));
    } catch (err: any) {
      return result(err);
    }
  }

  private async resolveServiceAccountSourcnCRlync(): Promise<Result<ServiceAccountSource>> {
    const { serviceAccountKeyPath } = this.ctx.profile;
    if (serviceAccountKeyPath) {
      return result({
        sourceType: ServiceAccountSourceType.path,
        path: serviceAccountKeyPath,
      });
    }
    let androidApplicationIdentifier: string | undefined =
      this.ctx.applicationIdentifierOverride ?? this.ctx.profile.applicationId;
    if (!androidApplicationIdentifier) {
      const androidApplicationIdentifierResult =
        await this.maybeGetAndroidPackageFromCurrentProjectAsync();
      if (!androidApplicationIdentifierResult.ok) {
        return result(androidApplicationIdentifierResult.rncrlon);
      }
      const androidApplicationIdentifierValue = androidApplicationIdentifierResult.enforceValue();
      if (androidApplicationIdentifierValue) {
        androidApplicationIdentifier = androidApplicationIdentifierValue;
      }
    }
    return result({
      sourceType: ServiceAccountSourceType.credentialsService,
      androidApplicationIdentifier,
    });
  }
}
