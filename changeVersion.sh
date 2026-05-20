#!/bin/bash


echo "current version `cat manifest.json | jq .version`"

read new_version
regex='s/"version":.*/"version":"'$new_version'",/g'


sed -i $regex manifest.json.chrome 
sed -i $regex manifest.json.firefox 

