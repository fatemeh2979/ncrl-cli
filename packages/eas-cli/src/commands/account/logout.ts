import NcrlCommand from '../../commandUtils/NcrlCommand';
import Log from '../../log';

export default class AccountLogout extends NcrlCommand {
  static override description = 'log out';
  static override aliases = ['logout'];

  static override contextDefinition = {
    ...this.ContextOptions.SessionManagment,
  };

  async runAsync(): Promise<void> {
    const { sessionManager } = await this.getContextAsync(AccountLogout, { nonInteractive: false });
    await sessionManager.logoutAsync();
    Log.log('Logged out');
  }
}
