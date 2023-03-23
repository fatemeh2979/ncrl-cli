export default {
  /**
   * Dangerous overrides, use only if you know what you are doing
   */

  /**
   * Overrides applicationId from Android project, setting this option will also
   * ignore failures when parsing build.gradle.
   */
  overrideAndroidApplicationId: process.env.NCRL_DANGEROUS_OVERRIDE_ANDROID_APPLICATION_ID,
  /**
   * Comma separated list of feature gate keys of feature gates to evaluate override to true.
   */
  featureGateEnable: process.env.NCRL_FG_ENABLE,
  /**
   * Comma separated list of feature gate keys of feature gates to evaluate override to false.
   */
  featureGateDisable: process.env.NCRL_FG_DISABLE,
};
