#!/bin/bash
#########################################

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. "$DIR/shared.sh"

##########################################

echo "Date: $(date +"%Y-%m-%d")"

SOURCE=`pwd`

# check if currently in git repository root
if [ ! -d "${SOURCE}/.git" ] ; then
    echo  "Currently ${RED} not in git ${RESTORE} repository."
    exit 1;
fi

nextTag="`$1`"

# check if next production tag is passed
if [ -z "$nextTag" ]; then

    # # update local tags information
    git fetch --prune origin +refs/tags/*:refs/tags/*
    lastTag=`git tag -l | sort -V | tail -n1`
    nextTag="`python3 prod/make_next_tag.py $lastTag`"
    echo "${YELLOW}Last tag:${RESTORE} ${lastTag}";
    echo "${GREEN}Next tag:${RESTORE} ${nextTag}";

    #exit 1;
fi

# checkout master
git checkout -f production

if [ $? -ne 0 ]; then
    echo "Switching to production tag failed. Please fix the occurred problems and run the script again.";
    exit 1;
fi;

git fetch origin master

# pull all the changes from origin
git pull origin production

# check if this tag
tagReference=`git show-ref $nextTag`

if [ -n "$tagReference" ];
then
    echo "Tag ${BLINK}${RED}${nextTag}${RESTORE} already exists. Please choose another one.";
    exit 1;
else
    echo "Tag does not exist. Creating tag ${nextTag}.";
fi

# merge production tag with master
git merge origin/master -m "merge updates from master for tag ${nextTag}"

if [ $? -ne 0 ]; then
    echo "Merge ${BLINK}${RED}failed${RESTORE}. Please fix the occurred problems and run the script again.";
    exit 1;
fi;

# update node_modules and build webpack
./build.sh
echo "$nextTag" > public/CURRENT_PRODUCTION_TAG

# add node_modules and webpack changes
git add --force node_modules
git add --force public/terminal-bundle.js
git add --force public/terminal-bundle.js.map
git add --force public/CURRENT_PRODUCTION_TAG

# commit vendor changes
git commit -m "Update node_modules and webpack output for ${nextTag}"

# save changes to production tag
git push origin production

if [ $? -ne 0 ]; then
    echo "   ${RED}Push failed${RESET}. Please fix the occurred problems and run the script again.";
    exit 1;
fi;

# create tag
git tag -a "$nextTag" -m "Release ${nextTag}"

# push tag
git push origin "$nextTag"

if [ $? -ne 0 ]; then
    echo "Tag push failed. Please fix the occurred problems and run the script again.";
    exit 1;
fi;
