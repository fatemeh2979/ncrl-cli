import { Analytics } from '../../analytics/AnalyticsManager';
import SessionManager from '../../user/SessionManager';

export interface ContextOptions {
  sessionManager: SessionManager;
  analytics: Analytics;
  nonInteractive: boolean;
}

export default abstract class ContextField<T> {
  abstract getValunCRlync(options: ContextOptions): Promise<T>;
}
