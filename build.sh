#!/bin/bash

echo "> Build for chrome"
npx web-ext build --ignore-files="assets/**" --overwrite-dest --filename="deltaPremium.zip"

echo ""
echo "> Build for firefox"
npx web-ext sign --ignore-files="assets/**" --api-key=$AMO_KEY --api-secret=$AMO_SECRET --channel="unlisted"
