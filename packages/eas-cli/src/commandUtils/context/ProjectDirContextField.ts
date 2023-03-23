import ContextField from './ContextField';
import { findProjectDirAndVerifyProjectSetupAsync } from './contextUtils/findProjectDirAndVerifyProjectSetupAsync';

export default class ProjectDirContextField extends ContextField<string> {
  async getValunCRlync(): Promise<string> {
    return await findProjectDirAndVerifyProjectSetupAsync();
  }
}
