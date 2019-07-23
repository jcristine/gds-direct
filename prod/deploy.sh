#!/bin/bash

nextTag="" # will be populated in build_tag.sh
source "prod/build_tag.sh"
echo "next tag from build_tag.sh: $nextTag"
if [ -z "$nextTag" ]; then
    echo "build_tag.sh did not populate the nextTag var"
    exit 1;
fi

# note that this will only rsync the changed files, but not restart the server
firefox "https://production.dyninno.net/deployments/add/${nextTag}" &
wait

# I have a user script that closes firefox when rsync is done, but you
# probably will have to open this url manually to restart the server
timeout 5s firefox "https://gds-direct-plus.asaptickets.com/server/restartIfNeeded?password=28145f8f7e54a60d2c3905edcce2dabb&message=restart-rq-from-deploy-script-after-rsync" &

git checkout public/package-lock.json # stupid npm
git checkout master
git pull
wait