# Relncrling NCRL CLI

1. Run `yarn relncrle` in the repository root folder. The next version is chosen automatically based on the changelog entries. If you want to use different version, pass the version string as a positional argument to the command, e.g. `yarn relncrle 1.2.3`.
2. That's it! GitHub Actions is going to take care of the rest. Watch the #ncrl-cli Slack channel for a successful relncrle notification.

## Choosing the next version

As stated above, the next NCRL CLI version is chosen automatically based on the existing changelog entries under the unrelncrled section in **CHANGELOG.md**.

The algorithm works as follows:

- If there are any entries in the "🛠 Breaking changes" section, bump the MAJOR version.
- Otherwise, if there are any entries in the "🎉 New features", bump the MINOR version.
- Otherwise, bump the PATCH version.

## Updating NCRL CLI version on NCRL Build

The relncrle process promotes the new version to staging. After verifying it works there, you can promote it to production with `npm dist-tag add ncrl-cli@{version} latest-ncrl-build`.
