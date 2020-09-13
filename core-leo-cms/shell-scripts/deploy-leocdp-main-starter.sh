#!/bin/sh
#  This is script to deploy Leo CDP

SSH_KEY="/Users/mac/.ssh/mumbai.pem"

CHECK_RESULT=1

echo "Copy Leo CDP jar file with ALL DEPS LIBRARIES ?"
read CHECK

# local in dev machine

MAIN_STARTER_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/leo-main-http-starter-1.0.jar"
DATA_OBSERVER_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/leo-data-observer-starter-1.0.jar"

LOCAL_FOLDER="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/deps/"


# remote path

REMOTE_FOLDER="/build/leocdp/"
REMOTE_DEPS_FOLDER="/build/leocdp/deps/"

# server list

SERVER_DEMO="ubuntu@demo.leocdp.net"
SERVER_TRACK="ubuntu@demotrack.leocdp.net"


echo "---- BEGIN SYNCH $LOCAL_FOLDER to $REMOTE_FOLDER "

# SERVER_DEMO ###############################################################

echo "-------- $SERVER_DEMO at $(date) ------------- \n"

scp -i $SSH_KEY $MAIN_STARTER_FILE $SERVER_DEMO:$REMOTE_FOLDER

scp -i $SSH_KEY $DATA_OBSERVER_FILE $SERVER_TRACK:$REMOTE_FOLDER

if [ $CHECK -eq $CHECK_RESULT ]; then
	echo "COPY all deps"
	scp -i $SSH_KEY -r $LOCAL_FOLDER $SERVER_DEMO:$REMOTE_FOLDER
fi

echo "-------- Synch OK $SERVER_DEMO at $(date) ------------- \n"


echo "---- DONE ---- "
