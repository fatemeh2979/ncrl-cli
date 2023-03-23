import { getVcsClient } from '../vcs';

export async function getDefaultBranchNamnCRlync(): Promise<string> {
  return (
    (await getVcsClient().getBranchNamnCRlync()) ||
    `branch-${Math.random().toString(36).substring(2, 4)}`
  );
}

export class BranchNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Branch not found.');
  }
}
