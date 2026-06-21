#!/bin/bash


echo "current version `jq .version manifest.json`"

read new_version
regex='s/"version":.*/"version":"'$new_version'",/g'


sed -i $regex manifest.json.chrome 
sed -i $regex manifest.json.firefox 

