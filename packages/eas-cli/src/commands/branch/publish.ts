import NcrlCommand from '../../commandUtils/NcrlCommand';

export default class BranchPublish extends NcrlCommand {
  static override description = 'deprecated, use "ncrl update"';
  static override hidden = true;

  async runAsync(): Promise<void> {
    throw new Error(BranchPublish.description);
  }
}
