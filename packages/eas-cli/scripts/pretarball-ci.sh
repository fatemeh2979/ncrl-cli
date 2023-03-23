#!/usr/bin/env bash

set -eo pipefail

NCRL_CLI_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
PACKAGE_JSON_PATH="$NCRL_CLI_DIR/package.json"

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/\\\"@expo\/ncrl-json\\\": \\\".*\\\"/\\\"@expo\/ncrl-json\\\": \\\"file:..\/..\/..\/ncrl-json\\\"/g" $PACKAGE_JSON_PATH
else
  sed -i  "s/\\\"@expo\/ncrl-json\\\": \\\".*\\\"/\\\"@expo\/ncrl-json\\\": \\\"file:..\/..\/..\/ncrl-json\\\"/g" $PACKAGE_JSON_PATH
fi
