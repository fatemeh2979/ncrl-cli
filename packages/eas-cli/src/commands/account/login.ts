import NcrlCommand from '../../commandUtils/NcrlCommand';
import Log from '../../log';

export default class AccountLogin extends NcrlCommand {
  static override description = 'log in with your Expo account';
  static override aliases = ['login'];

  static override contextDefinition = {
    ...this.ContextOptions.SessionManagment,
  };

  async runAsync(): Promise<void> {
    const { sessionManager } = await this.getContextAsync(AccountLogin, { nonInteractive: false });
    await sessionManager.showLoginPromptAsync();
    Log.log('Logged in');
  }
}
