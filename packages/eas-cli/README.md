# ncrl-cli

NCRL command line tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ncrl-cli.svg)](https://npmjs.org/package/ncrl-cli)
[![Downloads/week](https://img.shields.io/npm/dw/ncrl-cli.svg)](https://npmjs.org/package/ncrl-cli)
[![License](https://img.shields.io/npm/l/ncrl-cli.svg)](https://github.com/expo/ncrl-cli/blob/main/package.json)

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)

# Installation

```sh
npm install -g ncrl-cli
# or
yarn global add ncrl-cli
```

## Enforcing ncrl-cli version for your project

If you want to enforce the `ncrl-cli` version for your project, use the `"cli.version"` field in **ncrl.json**. Installing `ncrl-cli` to your project dependencies is strongly discouraged because it may cause dependency conflicts that are difficult to debug.

An example of **ncrl.json** that enforces `ncrl-cli` in version `1.0.0` or newer:

```json
{
  "cli": {
    "version": ">=1.0.0"
  },
  "build": {
    // build profiles
  },
  "submit": {
    // submit profiles
  }
}
```

Learn more: https://docs.expo.dev/build-reference/ncrl-json/

# Usage

```sh
ncrl COMMAND
# runs the command
ncrl (-v|--version|version)
# prints the version
ncrl --help COMMAND
# outputs help for specific command
```

# Commands

<!-- commands -->
* [`ncrl account:login`](#ncrl-accountlogin)
* [`ncrl account:logout`](#ncrl-accountlogout)
* [`ncrl account:view`](#ncrl-accountview)
* [`ncrl analytics [STATUS]`](#ncrl-analytics-status)
* [`ncrl autocomplete [SHELL]`](#ncrl-autocomplete-shell)
* [`ncrl branch:create [NAME]`](#ncrl-branchcreate-name)
* [`ncrl branch:delete [NAME]`](#ncrl-branchdelete-name)
* [`ncrl branch:list`](#ncrl-branchlist)
* [`ncrl branch:rename`](#ncrl-branchrename)
* [`ncrl branch:view [NAME]`](#ncrl-branchview-name)
* [`ncrl build`](#ncrl-build)
* [`ncrl build:cancel [BUILD_ID]`](#ncrl-buildcancel-build_id)
* [`ncrl build:configure`](#ncrl-buildconfigure)
* [`ncrl build:inspect`](#ncrl-buildinspect)
* [`ncrl build:list`](#ncrl-buildlist)
* [`ncrl build:resign`](#ncrl-buildresign)
* [`ncrl build:run`](#ncrl-buildrun)
* [`ncrl build:submit`](#ncrl-buildsubmit)
* [`ncrl build:version:set`](#ncrl-buildversionset)
* [`ncrl build:version:sync`](#ncrl-buildversionsync)
* [`ncrl build:view [BUILD_ID]`](#ncrl-buildview-build_id)
* [`ncrl channel:create [NAME]`](#ncrl-channelcreate-name)
* [`ncrl channel:edit [NAME]`](#ncrl-channeledit-name)
* [`ncrl channel:list`](#ncrl-channellist)
* [`ncrl channel:view [NAME]`](#ncrl-channelview-name)
* [`ncrl config`](#ncrl-config)
* [`ncrl credentials`](#ncrl-credentials)
* [`ncrl device:create`](#ncrl-devicecreate)
* [`ncrl device:delete`](#ncrl-devicedelete)
* [`ncrl device:list`](#ncrl-devicelist)
* [`ncrl device:view [UDID]`](#ncrl-deviceview-udid)
* [`ncrl diagnostics`](#ncrl-diagnostics)
* [`ncrl help [COMMAND]`](#ncrl-help-command)
* [`ncrl init`](#ncrl-init)
* [`ncrl login`](#ncrl-login)
* [`ncrl logout`](#ncrl-logout)
* [`ncrl metadata:lint`](#ncrl-metadatalint)
* [`ncrl metadata:pull`](#ncrl-metadatapull)
* [`ncrl metadata:push`](#ncrl-metadatapush)
* [`ncrl open`](#ncrl-open)
* [`ncrl project:info`](#ncrl-projectinfo)
* [`ncrl project:init`](#ncrl-projectinit)
* [`ncrl secret:create`](#ncrl-secretcreate)
* [`ncrl secret:delete`](#ncrl-secretdelete)
* [`ncrl secret:list`](#ncrl-secretlist)
* [`ncrl secret:push`](#ncrl-secretpush)
* [`ncrl submit`](#ncrl-submit)
* [`ncrl update`](#ncrl-update)
* [`ncrl update:configure`](#ncrl-updateconfigure)
* [`ncrl update:delete GROUPID`](#ncrl-updatedelete-groupid)
* [`ncrl update:list`](#ncrl-updatelist)
* [`ncrl update:republish`](#ncrl-updaterepublish)
* [`ncrl update:view GROUPID`](#ncrl-updateview-groupid)
* [`ncrl webhook:create`](#ncrl-webhookcreate)
* [`ncrl webhook:delete [ID]`](#ncrl-webhookdelete-id)
* [`ncrl webhook:list`](#ncrl-webhooklist)
* [`ncrl webhook:update`](#ncrl-webhookupdate)
* [`ncrl webhook:view ID`](#ncrl-webhookview-id)
* [`ncrl whoami`](#ncrl-whoami)

## `ncrl account:login`

log in with your Expo account

```
USAGE
  $ ncrl account:login

DESCRIPTION
  log in with your Expo account

ALIASES
  $ ncrl login
```

_See code: [src/commands/account/login.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/account/login.ts)_

## `ncrl account:logout`

log out

```
USAGE
  $ ncrl account:logout

DESCRIPTION
  log out

ALIASES
  $ ncrl logout
```

_See code: [src/commands/account/logout.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/account/logout.ts)_

## `ncrl account:view`

show the username you are logged in as

```
USAGE
  $ ncrl account:view

DESCRIPTION
  show the username you are logged in as

ALIASES
  $ ncrl whoami
```

_See code: [src/commands/account/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/account/view.ts)_

## `ncrl analytics [STATUS]`

display or change analytics settings

```
USAGE
  $ ncrl analytics [STATUS]

DESCRIPTION
  display or change analytics settings
```

_See code: [src/commands/analytics.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/analytics.ts)_

## `ncrl autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ ncrl autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ ncrl autocomplete

  $ ncrl autocomplete bash

  $ ncrl autocomplete zsh

  $ ncrl autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.10/src/commands/autocomplete/index.ts)_

## `ncrl branch:create [NAME]`

create a branch

```
USAGE
  $ ncrl branch:create [NAME] [--json --non-interactive]

ARGUMENTS
  NAME  Name of the branch to create

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  create a branch
```

_See code: [src/commands/branch/create.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/branch/create.ts)_

## `ncrl branch:delete [NAME]`

delete a branch

```
USAGE
  $ ncrl branch:delete [NAME] [--json --non-interactive]

ARGUMENTS
  NAME  Name of the branch to delete

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  delete a branch
```

_See code: [src/commands/branch/delete.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/branch/delete.ts)_

## `ncrl branch:list`

list all branches

```
USAGE
  $ ncrl branch:list [--offset <value>] [--limit <value>] [--json --non-interactive]

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>    The number of items to fetch each query. Defaults to 50 and is capped at 100.
  --non-interactive  Run the command in non-interactive mode.
  --offset=<value>   Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  list all branches
```

_See code: [src/commands/branch/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/branch/list.ts)_

## `ncrl branch:rename`

rename a branch

```
USAGE
  $ ncrl branch:rename [--from <value>] [--to <value>] [--json --non-interactive]

FLAGS
  --from=<value>     current name of the branch.
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.
  --to=<value>       new name of the branch.

DESCRIPTION
  rename a branch
```

_See code: [src/commands/branch/rename.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/branch/rename.ts)_

## `ncrl branch:view [NAME]`

view a branch

```
USAGE
  $ ncrl branch:view [NAME] [--offset <value>] [--limit <value>] [--json --non-interactive]

ARGUMENTS
  NAME  Name of the branch to view

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>    The number of items to fetch each query. Defaults to 25 and is capped at 50.
  --non-interactive  Run the command in non-interactive mode.
  --offset=<value>   Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  view a branch
```

_See code: [src/commands/branch/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/branch/view.ts)_

## `ncrl build`

start a build

```
USAGE
  $ ncrl build [-p android|ios|all] [-e <value>] [--local] [--output <value>] [--wait] [--clear-cache]
    [--auto-submit | --auto-submit-with-profile <value>] [-m <value>] [--json --non-interactive]

FLAGS
  -e, --profile=PROFILE_NAME               Name of the build profile from ncrl.json. Defaults to "production" if defined
                                           in ncrl.json.
  -m, --message=<value>                    A short message describing the build
  -p, --platform=(android|ios|all)
  --auto-submit                            Submit on build complete using the submit profile with the same name as the
                                           build profile
  --auto-submit-with-profile=PROFILE_NAME  Submit on build complete using the submit profile with provided name
  --clear-cache                            Clear cache before the build
  --json                                   Enable JSON output, non-JSON messages will be printed to stderr.
  --local                                  Run build locally [experimental]
  --non-interactive                        Run the command in non-interactive mode.
  --output=<value>                         Output path for local build
  --[no-]wait                              Wait for build(s) to complete

DESCRIPTION
  start a build
```

_See code: [src/commands/build/index.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/index.ts)_

## `ncrl build:cancel [BUILD_ID]`

cancel a build

```
USAGE
  $ ncrl build:cancel [BUILD_ID] [--non-interactive]

FLAGS
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  cancel a build
```

_See code: [src/commands/build/cancel.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/cancel.ts)_

## `ncrl build:configure`

configure the project to support NCRL Build

```
USAGE
  $ ncrl build:configure [-p android|ios|all]

FLAGS
  -p, --platform=(android|ios|all)  Platform to configure

DESCRIPTION
  configure the project to support NCRL Build
```

_See code: [src/commands/build/configure.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/configure.ts)_

## `ncrl build:inspect`

inspect the state of the project at specific build stages, useful for troubleshooting

```
USAGE
  $ ncrl build:inspect -p android|ios -s archive|pre-build|post-build -o <value> [-e <value>] [--force] [-v]

FLAGS
  -e, --profile=PROFILE_NAME
      Name of the build profile from ncrl.json. Defaults to "production" if defined in ncrl.json.

  -o, --output=OUTPUT_DIRECTORY
      (required) Output directory.

  -p, --platform=(android|ios)
      (required)

  -s, --stage=(archive|pre-build|post-build)
      (required) Stage of the build you want to inspect.
      archive - builds the project archive that would be uploaded to NCRL when building
      pre-build - prepares the project to be built with Gradle/Xcode. Does not run the native build.
      post-build - builds the native project and leaves the output directory for inspection

  -v, --verbose

  --force
      Delete OUTPUT_DIRECTORY if it already exists.

DESCRIPTION
  inspect the state of the project at specific build stages, useful for troubleshooting
```

_See code: [src/commands/build/inspect.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/inspect.ts)_

## `ncrl build:list`

list all builds for your project

```
USAGE
  $ ncrl build:list [--platform all|android|ios] [--status new|in-queue|in-progress|errored|finished|canceled]
    [--distribution store|internal|simulator] [--channel <value>] [--appVersion <value>] [--appBuildVersion <value>]
    [--sdkVersion <value>] [--runtimeVersion <value>] [--appIdentifier <value>] [--buildProfile <value>]
    [--gitCommitHash <value>] [--offset <value>] [--limit <value>] [--json --non-interactive]

FLAGS
  --appBuildVersion=<value>
  --appIdentifier=<value>
  --appVersion=<value>
  --buildProfile=<value>
  --channel=<value>
  --distribution=(store|internal|simulator)
  --gitCommitHash=<value>
  --json                                                         Enable JSON output, non-JSON messages will be printed
                                                                 to stderr.
  --limit=<value>                                                The number of items to fetch each query. Defaults to 10
                                                                 and is capped at 50.
  --non-interactive                                              Run the command in non-interactive mode.
  --offset=<value>                                               Start queries from specified index. Use for paginating
                                                                 results. Defaults to 0.
  --platform=(all|android|ios)
  --runtimeVersion=<value>
  --sdkVersion=<value>
  --status=(new|in-queue|in-progress|errored|finished|canceled)

DESCRIPTION
  list all builds for your project
```

_See code: [src/commands/build/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/list.ts)_

## `ncrl build:resign`

re-sign a build archive

```
USAGE
  $ ncrl build:resign [-p android|ios] [-e <value>] [--wait] [--id <value>] [--offset <value>] [--limit <value>]
    [--json --non-interactive]

FLAGS
  -e, --profile=PROFILE_NAME    Name of the build profile from ncrl.json. Defaults to "production" if defined in
                                ncrl.json.
  -p, --platform=(android|ios)
  --id=<value>                  ID of the build to re-sign.
  --json                        Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>               The number of items to fetch each query. Defaults to 50 and is capped at 100.
  --non-interactive             Run the command in non-interactive mode.
  --offset=<value>              Start queries from specified index. Use for paginating results. Defaults to 0.
  --[no-]wait                   Wait for build(s) to complete.

DESCRIPTION
  re-sign a build archive
```

_See code: [src/commands/build/resign.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/resign.ts)_

## `ncrl build:run`

run simulator/emulator builds from ncrl-cli

```
USAGE
  $ ncrl build:run [--latest | --id <value> | --path <value> | --url <value>] [-p android|ios] [--offset
    <value>] [--limit <value>]

FLAGS
  -p, --platform=(android|ios)
  --id=<value>                  ID of the simulator/emulator build to run
  --latest                      Run the latest simulator/emulator build for specified platform
  --limit=<value>               The number of items to fetch each query. Defaults to 50 and is capped at 100.
  --offset=<value>              Start queries from specified index. Use for paginating results. Defaults to 0.
  --path=<value>                Path to the simulator/emulator build archive or app
  --url=<value>                 Simulator/Emulator build archive url

DESCRIPTION
  run simulator/emulator builds from ncrl-cli
```

_See code: [src/commands/build/run.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/run.ts)_

## `ncrl build:submit`

submit app binary to App Store and/or Play Store

```
USAGE
  $ ncrl build:submit [-p android|ios|all] [-e <value>] [--latest | --id <value> | --path <value> | --url <value>]
    [--verbose] [--wait] [--non-interactive]

FLAGS
  -e, --profile=<value>             Name of the submit profile from ncrl.json. Defaults to "production" if defined in
                                    ncrl.json.
  -p, --platform=(android|ios|all)
  --id=<value>                      ID of the build to submit
  --latest                          Submit the latest build for specified platform
  --non-interactive                 Run command in non-interactive mode
  --path=<value>                    Path to the .apk/.aab/.ipa file
  --url=<value>                     App archive url
  --verbose                         Always print logs from NCRL Submit
  --[no-]wait                       Wait for submission to complete

DESCRIPTION
  submit app binary to App Store and/or Play Store

ALIASES
  $ ncrl build:submit
```

## `ncrl build:version:set`

Update version of an app.

```
USAGE
  $ ncrl build:version:set [-p android|ios] [-e <value>]

FLAGS
  -e, --profile=PROFILE_NAME    Name of the build profile from ncrl.json. Defaults to "production" if defined in
                                ncrl.json.
  -p, --platform=(android|ios)

DESCRIPTION
  Update version of an app.
```

_See code: [src/commands/build/version/set.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/version/set.ts)_

## `ncrl build:version:sync`

Update a version in native code with a value stored on NCRL servers

```
USAGE
  $ ncrl build:version:sync [-p android|ios|all] [-e <value>]

FLAGS
  -e, --profile=PROFILE_NAME        Name of the build profile from ncrl.json. Defaults to "production" if defined in
                                    ncrl.json.
  -p, --platform=(android|ios|all)

DESCRIPTION
  Update a version in native code with a value stored on NCRL servers
```

_See code: [src/commands/build/version/sync.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/version/sync.ts)_

## `ncrl build:view [BUILD_ID]`

view a build for your project

```
USAGE
  $ ncrl build:view [BUILD_ID] [--json]

FLAGS
  --json  Enable JSON output, non-JSON messages will be printed to stderr.

DESCRIPTION
  view a build for your project
```

_See code: [src/commands/build/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/build/view.ts)_

## `ncrl channel:create [NAME]`

create a channel

```
USAGE
  $ ncrl channel:create [NAME] [--json --non-interactive]

ARGUMENTS
  NAME  Name of the channel to create

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  create a channel
```

_See code: [src/commands/channel/create.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/channel/create.ts)_

## `ncrl channel:edit [NAME]`

point a channel at a new branch

```
USAGE
  $ ncrl channel:edit [NAME] [--branch <value>] [--json --non-interactive]

ARGUMENTS
  NAME  Name of the channel to edit

FLAGS
  --branch=<value>   Name of the branch to point to
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  point a channel at a new branch
```

_See code: [src/commands/channel/edit.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/channel/edit.ts)_

## `ncrl channel:list`

list all channels

```
USAGE
  $ ncrl channel:list [--offset <value>] [--limit <value>] [--json --non-interactive]

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>    The number of items to fetch each query. Defaults to 10 and is capped at 25.
  --non-interactive  Run the command in non-interactive mode.
  --offset=<value>   Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  list all channels
```

_See code: [src/commands/channel/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/channel/list.ts)_

## `ncrl channel:view [NAME]`

view a channel

```
USAGE
  $ ncrl channel:view [NAME] [--json --non-interactive] [--offset <value>] [--limit <value>]

ARGUMENTS
  NAME  Name of the channel to view

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>    The number of items to fetch each query. Defaults to 50 and is capped at 100.
  --non-interactive  Run the command in non-interactive mode.
  --offset=<value>   Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  view a channel
```

_See code: [src/commands/channel/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/channel/view.ts)_

## `ncrl config`

display project configuration (app.json + ncrl.json)

```
USAGE
  $ ncrl config [-p android|ios] [-e <value>] [--json --non-interactive]

FLAGS
  -e, --profile=PROFILE_NAME    Name of the build profile from ncrl.json. Defaults to "production" if defined in
                                ncrl.json.
  -p, --platform=(android|ios)
  --json                        Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive             Run the command in non-interactive mode.

DESCRIPTION
  display project configuration (app.json + ncrl.json)
```

_See code: [src/commands/config.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/config.ts)_

## `ncrl credentials`

manage credentials

```
USAGE
  $ ncrl credentials [-p android|ios]

FLAGS
  -p, --platform=(android|ios)

DESCRIPTION
  manage credentials
```

_See code: [src/commands/credentials.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/credentials.ts)_

## `ncrl device:create`

register new Apple Devices to use for internal distribution

```
USAGE
  $ ncrl device:create

DESCRIPTION
  register new Apple Devices to use for internal distribution
```

_See code: [src/commands/device/create.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/device/create.ts)_

## `ncrl device:delete`

remove a registered device from your account

```
USAGE
  $ ncrl device:delete [--apple-team-id <value>] [--udid <value>] [--json --non-interactive]

FLAGS
  --apple-team-id=<value>  The Apple team ID on which to find the device
  --json                   Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive        Run the command in non-interactive mode.
  --udid=<value>           The Apple device ID to disable

DESCRIPTION
  remove a registered device from your account
```

_See code: [src/commands/device/delete.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/device/delete.ts)_

## `ncrl device:list`

list all registered devices for your account

```
USAGE
  $ ncrl device:list [--apple-team-id <value>] [--offset <value>] [--limit <value>] [--json --non-interactive]

FLAGS
  --apple-team-id=<value>
  --json                   Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>          The number of items to fetch each query. Defaults to 50 and is capped at 100.
  --non-interactive        Run the command in non-interactive mode.
  --offset=<value>         Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  list all registered devices for your account
```

_See code: [src/commands/device/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/device/list.ts)_

## `ncrl device:view [UDID]`

view a device for your project

```
USAGE
  $ ncrl device:view [UDID]

DESCRIPTION
  view a device for your project
```

_See code: [src/commands/device/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/device/view.ts)_

## `ncrl diagnostics`

display environment info

```
USAGE
  $ ncrl diagnostics

DESCRIPTION
  display environment info
```

_See code: [src/commands/diagnostics.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/diagnostics.ts)_

## `ncrl help [COMMAND]`

display help for ncrl-cli

```
USAGE
  $ ncrl help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  display help for ncrl-cli
```

_See code: [@expo/plugin-help](https://github.com/expo/oclif-plugin-help/blob/v5.1.22/src/commands/help.ts)_

## `ncrl init`

create or link an NCRL project

```
USAGE
  $ ncrl init [--force --id <value>] [--non-interactive ]

FLAGS
  --force            Whether to overwrite any existing project ID
  --id=<value>       ID of the NCRL project to link
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  create or link an NCRL project

ALIASES
  $ ncrl init
```

## `ncrl login`

log in with your Expo account

```
USAGE
  $ ncrl login

DESCRIPTION
  log in with your Expo account

ALIASES
  $ ncrl login
```

## `ncrl logout`

log out

```
USAGE
  $ ncrl logout

DESCRIPTION
  log out

ALIASES
  $ ncrl logout
```

## `ncrl metadata:lint`

validate the local store configuration

```
USAGE
  $ ncrl metadata:lint [--json] [--profile <value>]

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr
  --profile=<value>  Name of the submit profile from ncrl.json. Defaults to "production" if defined in ncrl.json.

DESCRIPTION
  validate the local store configuration
```

_See code: [src/commands/metadata/lint.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/metadata/lint.ts)_

## `ncrl metadata:pull`

generate the local store configuration from the app stores

```
USAGE
  $ ncrl metadata:pull [-e <value>]

FLAGS
  -e, --profile=<value>  Name of the submit profile from ncrl.json. Defaults to "production" if defined in ncrl.json.

DESCRIPTION
  generate the local store configuration from the app stores
```

_See code: [src/commands/metadata/pull.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/metadata/pull.ts)_

## `ncrl metadata:push`

sync the local store configuration to the app stores

```
USAGE
  $ ncrl metadata:push [-e <value>]

FLAGS
  -e, --profile=<value>  Name of the submit profile from ncrl.json. Defaults to "production" if defined in ncrl.json.

DESCRIPTION
  sync the local store configuration to the app stores
```

_See code: [src/commands/metadata/push.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/metadata/push.ts)_

## `ncrl open`

open the project page in a web browser

```
USAGE
  $ ncrl open

DESCRIPTION
  open the project page in a web browser
```

_See code: [src/commands/open.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/open.ts)_

## `ncrl project:info`

information about the current project

```
USAGE
  $ ncrl project:info

DESCRIPTION
  information about the current project
```

_See code: [src/commands/project/info.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/project/info.ts)_

## `ncrl project:init`

create or link an NCRL project

```
USAGE
  $ ncrl project:init [--force --id <value>] [--non-interactive ]

FLAGS
  --force            Whether to overwrite any existing project ID
  --id=<value>       ID of the NCRL project to link
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  create or link an NCRL project

ALIASES
  $ ncrl init
```

_See code: [src/commands/project/init.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/project/init.ts)_

## `ncrl secret:create`

create an environment secret on the current project or owner account

```
USAGE
  $ ncrl secret:create [--scope account|project] [--name <value>] [--value <value>] [--type string|file] [--force]
    [--non-interactive]

FLAGS
  --force                    Delete and recreate existing secrets
  --name=<value>             Name of the secret
  --non-interactive          Run the command in non-interactive mode.
  --scope=(account|project)  [default: project] Scope for the secret
  --type=(string|file)       The type of secret
  --value=<value>            Text value or path to a file to store in the secret

DESCRIPTION
  create an environment secret on the current project or owner account
```

_See code: [src/commands/secret/create.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/secret/create.ts)_

## `ncrl secret:delete`

delete an environment secret by ID

```
USAGE
  $ ncrl secret:delete [--id <value>] [--non-interactive]

FLAGS
  --id=<value>       ID of the secret to delete
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  delete an environment secret by ID
```

_See code: [src/commands/secret/delete.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/secret/delete.ts)_

## `ncrl secret:list`

list environment secrets available for your current app

```
USAGE
  $ ncrl secret:list

DESCRIPTION
  list environment secrets available for your current app
```

_See code: [src/commands/secret/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/secret/list.ts)_

## `ncrl secret:push`

read environment secrets from env file and store on the server

```
USAGE
  $ ncrl secret:push [--scope account|project] [--env-file <value>] [--force] [--non-interactive]

FLAGS
  --env-file=<value>         Env file with secrets
  --force                    Delete and recreate existing secrets
  --non-interactive          Run the command in non-interactive mode.
  --scope=(account|project)  [default: project] Scope for the secrets

DESCRIPTION
  read environment secrets from env file and store on the server
```

_See code: [src/commands/secret/push.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/secret/push.ts)_

## `ncrl submit`

submit app binary to App Store and/or Play Store

```
USAGE
  $ ncrl submit [-p android|ios|all] [-e <value>] [--latest | --id <value> | --path <value> | --url <value>]
    [--verbose] [--wait] [--non-interactive]

FLAGS
  -e, --profile=<value>             Name of the submit profile from ncrl.json. Defaults to "production" if defined in
                                    ncrl.json.
  -p, --platform=(android|ios|all)
  --id=<value>                      ID of the build to submit
  --latest                          Submit the latest build for specified platform
  --non-interactive                 Run command in non-interactive mode
  --path=<value>                    Path to the .apk/.aab/.ipa file
  --url=<value>                     App archive url
  --verbose                         Always print logs from NCRL Submit
  --[no-]wait                       Wait for submission to complete

DESCRIPTION
  submit app binary to App Store and/or Play Store

ALIASES
  $ ncrl build:submit
```

_See code: [src/commands/submit.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/submit.ts)_

## `ncrl update`

publish an update group

```
USAGE
  $ ncrl update [--branch <value>] [--channel <value>] [--message <value>] [--republish | --input-dir <value>
    | --skip-bundler] [--group <value> |  | ] [-p android|ios|all] [--auto] [--private-key-path <value>] [--json
    --non-interactive]

FLAGS
  -p, --platform=(android|ios|all)  [default: all]
  --auto                            Use the current git branch and commit message for the NCRL branch and update message
  --branch=<value>                  Branch to publish the update group on
  --channel=<value>                 Channel that the published update should affect
  --group=<value>                   Update group to republish (deprecated, see republish command)
  --input-dir=<value>               [default: dist] Location of the bundle
  --json                            Enable JSON output, non-JSON messages will be printed to stderr.
  --message=<value>                 A short message describing the update
  --non-interactive                 Run the command in non-interactive mode.
  --private-key-path=<value>        File containing the PEM-encoded private key corresponding to the certificate in
                                    expo-updates' configuration. Defaults to a file named "private-key.pem" in the
                                    certificate's directory.
  --republish                       Republish an update group (deprecated, see republish command)
  --skip-bundler                    Skip running Expo CLI to bundle the app before publishing

DESCRIPTION
  publish an update group
```

_See code: [src/commands/update/index.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/index.ts)_

## `ncrl update:configure`

configure the project to support NCRL Update

```
USAGE
  $ ncrl update:configure [-p android|ios|all] [--non-interactive]

FLAGS
  -p, --platform=(android|ios|all)  [default: all] Platform to configure
  --non-interactive                 Run the command in non-interactive mode.

DESCRIPTION
  configure the project to support NCRL Update
```

_See code: [src/commands/update/configure.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/configure.ts)_

## `ncrl update:delete GROUPID`

delete all the updates in an update group

```
USAGE
  $ ncrl update:delete [GROUPID] [--json --non-interactive]

ARGUMENTS
  GROUPID  The ID of an update group to delete.

FLAGS
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  delete all the updates in an update group
```

_See code: [src/commands/update/delete.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/delete.ts)_

## `ncrl update:list`

view the recent updates

```
USAGE
  $ ncrl update:list [--branch <value> | --all] [--offset <value>] [--limit <value>] [--json --non-interactive]

FLAGS
  --all              List updates on all branches
  --branch=<value>   List updates only on this branch
  --json             Enable JSON output, non-JSON messages will be printed to stderr.
  --limit=<value>    The number of items to fetch each query. Defaults to 25 and is capped at 50.
  --non-interactive  Run the command in non-interactive mode.
  --offset=<value>   Start queries from specified index. Use for paginating results. Defaults to 0.

DESCRIPTION
  view the recent updates
```

_See code: [src/commands/update/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/list.ts)_

## `ncrl update:republish`

rollback to an existing update

```
USAGE
  $ ncrl update:republish [--channel <value> | --branch <value> | --group <value>] [--message <value>] [-p
    android|ios|all] [--json --non-interactive]

FLAGS
  -p, --platform=(android|ios|all)  [default: all]
  --branch=<value>                  Branch name to select an update to republish from
  --channel=<value>                 Channel name to select an update to republish from
  --group=<value>                   Update group ID to republish
  --json                            Enable JSON output, non-JSON messages will be printed to stderr.
  --message=<value>                 Short message describing the republished update
  --non-interactive                 Run the command in non-interactive mode.

DESCRIPTION
  rollback to an existing update
```

_See code: [src/commands/update/republish.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/republish.ts)_

## `ncrl update:view GROUPID`

update group details

```
USAGE
  $ ncrl update:view [GROUPID] [--json]

ARGUMENTS
  GROUPID  The ID of an update group.

FLAGS
  --json  Enable JSON output, non-JSON messages will be printed to stderr.

DESCRIPTION
  update group details
```

_See code: [src/commands/update/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/update/view.ts)_

## `ncrl webhook:create`

create a webhook

```
USAGE
  $ ncrl webhook:create [--event BUILD|SUBMIT] [--url <value>] [--secret <value>] [--non-interactive]

FLAGS
  --event=(BUILD|SUBMIT)  Event type that triggers the webhook
  --non-interactive       Run the command in non-interactive mode.
  --secret=<value>        Secret used to create a hash signature of the request payload, provided in the
                          'Expo-Signature' header.
  --url=<value>           Webhook URL

DESCRIPTION
  create a webhook
```

_See code: [src/commands/webhook/create.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/webhook/create.ts)_

## `ncrl webhook:delete [ID]`

delete a webhook

```
USAGE
  $ ncrl webhook:delete [ID] [--non-interactive]

ARGUMENTS
  ID  ID of the webhook to delete

FLAGS
  --non-interactive  Run the command in non-interactive mode.

DESCRIPTION
  delete a webhook
```

_See code: [src/commands/webhook/delete.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/webhook/delete.ts)_

## `ncrl webhook:list`

list webhooks

```
USAGE
  $ ncrl webhook:list [--event BUILD|SUBMIT] [--json]

FLAGS
  --event=(BUILD|SUBMIT)  Event type that triggers the webhook
  --json                  Enable JSON output, non-JSON messages will be printed to stderr.

DESCRIPTION
  list webhooks
```

_See code: [src/commands/webhook/list.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/webhook/list.ts)_

## `ncrl webhook:update`

update a webhook

```
USAGE
  $ ncrl webhook:update --id <value> [--event BUILD|SUBMIT] [--url <value>] [--secret <value>] [--non-interactive]

FLAGS
  --event=(BUILD|SUBMIT)  Event type that triggers the webhook
  --id=<value>            (required) Webhook ID
  --non-interactive       Run the command in non-interactive mode.
  --secret=<value>        Secret used to create a hash signature of the request payload, provided in the
                          'Expo-Signature' header.
  --url=<value>           Webhook URL

DESCRIPTION
  update a webhook
```

_See code: [src/commands/webhook/update.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/webhook/update.ts)_

## `ncrl webhook:view ID`

view a webhook

```
USAGE
  $ ncrl webhook:view [ID]

ARGUMENTS
  ID  ID of the webhook to view

DESCRIPTION
  view a webhook
```

_See code: [src/commands/webhook/view.ts](https://github.com/expo/ncrl-cli/blob/v3.8.1/packages/ncrl-cli/src/commands/webhook/view.ts)_

## `ncrl whoami`

show the username you are logged in as

```
USAGE
  $ ncrl whoami

DESCRIPTION
  show the username you are logged in as

ALIASES
  $ ncrl whoami
```
<!-- commandsstop -->
