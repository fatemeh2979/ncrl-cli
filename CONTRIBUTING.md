# Development

Set up an alias for the NCRL CLI so you can try it in projects all around your computer. The project is compiled on the fly so you don't need to run a build (watch) command.

> The only exception is when you just cloned the repository or there have been changes in `packages/ncrl-json`. In that case, you'll have to run `yarn build` in the root.

Open your `.zshrc` or other config file and add:

```
alias ncrld="/PATH/TO/ncrl-cli/bin/run"
```

Then use it with `ncrld` like `ncrld build`.

If you're making changes to `packages/ncrl-json` or prefer/need to work with production code, start the build command in watch mode with:

```
yarn start
```

## Format

- Be sure to update the [`CHANGELOG.md`](./CHANGELOG.md) with changes for every PR. There is a changelog bot that can generate the proper entry for you. The instructions on how to use it are in the PR description placeholder.
- End `async` functions with `Async` like `runAsync`. This is just how we format functions at Expo.
- Utilize the unified `Log` module instead of `console.log`.

## Using local and staging API

For development against local API:

- Set up the API server as described at https://github.com/expo/universe/tree/main/server/www.
- Set the `EXPO_LOCAL=1` env variable either on every command run (e.g. `EXPO_LOCAL=1 ncrld ...`) or more permamently with `export EXPO_LOCAL=1` (works in a current shell session).

For development against staging API:

- Set the `EXPO_STAGING=1` env variable either on every command run (e.g. `EXPO_STAGING=1 ncrld ...`) or more permamently with `export EXPO_STAGING=1` (works in a current shell session).

## Working on local builds (`ncrl build --local`)

See https://github.com/expo/ncrl-build/blob/main/DEVELOPMENT.md for how to set up your environment when making changes to [`ncrl-cli-local-build-plugin`](https://github.com/expo/ncrl-build/tree/main/packages/local-build-plugin) and/or [`build-tools`](https://github.com/expo/ncrl-build/tree/main/packages/build-tools).

## Testing

Run `yarn test` either in the repository root or in a package directory that you're working on.

## Relncrling

See [RELNCRLING.md](./RELNCRLING.md).
