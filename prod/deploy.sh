#!/bin/bash

nextTag="" # will be populated in build_tag.sh
bash "prod/build_tag.sh"
if [ -z "$nextTag" ]; then
    echo "build_tag.sh did not populate the nextTag var"
    exit 1;
fi

firefox "https://production.dyninno.net/deployments/add/${nextTag}" & 
git checkout public/package-lock.json # stupid npm
git checkout master
git pull
wait
