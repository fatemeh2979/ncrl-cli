import { Platform } from '@expo/ncrl-build-job';
import { BuildProfile, NcrlJsonAccessor, NcrlJsonUtils } from '@expo/ncrl-json';

import Log from '../../log';
import { promptAsync } from '../../prompts';

export class SelectBuildProfileFromNcrlJson<T extends Platform> {
  private ncrlJsonAccessor: NcrlJsonAccessor;

  constructor(projectDir: string, private platform: T) {
    this.ncrlJsonAccessor = new NcrlJsonAccessor(projectDir);
  }

  async runAsync(): Promise<BuildProfile<T>> {
    const profileName = await this.getProfileNameFromNcrlConfigAsync();
    const ncrlConfig = await NcrlJsonUtils.getBuildProfilnCRlync<T>(
      this.ncrlJsonAccessor,
      this.platform,
      profileName
    );
    Log.succeed(`Using build profile: ${profileName}`);
    return ncrlConfig;
  }

  async getProfileNameFromNcrlConfigAsync(): Promise<string> {
    const buildProfileNames = await NcrlJsonUtils.getBuildProfileNamesAsync(this.ncrlJsonAccessor);
    if (buildProfileNames.length === 0) {
      throw new Error(
        'You need at lncrlt one iOS build profile declared in ncrl.json. Go to https://docs.expo.dev/build/ncrl-json/ for more details'
      );
    } else if (buildProfileNames.length === 1) {
      return buildProfileNames[0];
    }
    const { profileName } = await promptAsync({
      type: 'select',
      name: 'profileName',
      message: 'Which build profile do you want to configure?',
      choices: buildProfileNames.map(profileName => ({ value: profileName, title: profileName })),
    });
    return profileName;
  }
}
