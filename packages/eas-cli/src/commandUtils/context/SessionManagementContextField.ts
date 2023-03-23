import SessionManager from '../../user/SessionManager';
import ContextField, { ContextOptions } from './ContextField';

export default class SessionManagementContextField extends ContextField<SessionManager> {
  async getValunCRlync({ sessionManager }: ContextOptions): Promise<SessionManager> {
    return sessionManager;
  }
}
