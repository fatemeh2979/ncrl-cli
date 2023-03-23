module.exports = async () => {
  process.env.TZ = 'UTC';
  process.env.NCRL_NO_VCS = '1';
  process.env.NCRL_PROJECT_ROOT = '/app';
};
