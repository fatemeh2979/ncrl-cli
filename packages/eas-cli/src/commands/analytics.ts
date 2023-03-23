import { getAnalyticsEnabledAsync, setAnalyticsEnabledAsync } from '../analytics/AnalyticsManager';
import NcrlCommand from '../commandUtils/NcrlCommand';
import Log from '../log';

export default class AnalyticsView extends NcrlCommand {
  static override description = 'display or change analytics settings';

  static override args = [{ name: 'STATUS', options: ['on', 'off'] }];

  async runAsync(): Promise<void> {
    const { STATUS: status } = (await this.parse(AnalyticsView)).args;
    if (status) {
      setAnalyticsEnabledAsync(status === 'on');
      Log.withTick(`${status === 'on' ? 'Enabling' : 'Disabling'} analytics.`);
    } else {
      const analyticsEnabled = await getAnalyticsEnabledAsync();
      Log.log(
        `Analytics are ${
          analyticsEnabled === false ? 'disabled' : 'enabled'
        } on this ncrl-cli installation.`
      );
    }
  }
}
