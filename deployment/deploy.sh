#!/bin/bash

usage() {
  echo "Usage: ./deploy.sh <version>"
  exit 1
}

VERSION="$1"

if [ -z "$VERSION" ]; then
  usage
fi

set -xue

# export https_proxy="http://127.0.0.1:8118"

cd /home/jizhang/timetable-fe
wget "https://github.com/jizhang/timetable-fe/releases/download/v${VERSION}/dist.tar.gz" -O - | tar zxf - --xform="s/dist/v${VERSION}/"
ln -snf v${VERSION} dist
