#!/bin/bash

echo "> Build for chrome"
name="deltapremium-$(jq -r ".version" manifest.json.chrome).zip"
cp manifest.json.chrome manifest.json
npx web-ext build --ignore-files="assets/**" --overwrite-dest --filename="$name"

echo ""
echo "> Build for firefox"
cp manifest.json.firefox manifest.json
if [[ "$1" == "local" ]];then
    npx web-ext build --ignore-files="assets/**" --overwrite-dest --filename="deltaPremium.xpi"
else
    npx web-ext sign --ignore-files="assets/**" --api-key=$AMO_KEY --api-secret=$AMO_SECRET --channel="unlisted"
fi
cp manifest.json.chrome manifest.json
