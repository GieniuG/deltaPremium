#!/bin/bash

echo "Build for chrome"
npx web-ext build --overwrite-dest --filename="deltaPremium.zip"

echo "Build for firefox"
npx web-ext sign --api-key=$AMO_KEY --api-secret=$AMO_SECRET --overwrite-dest --channel="unlisted" --filename "deltaPremium.xpi"
