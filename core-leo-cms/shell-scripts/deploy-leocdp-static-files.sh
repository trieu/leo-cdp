#!/bin/sh
#  This is script to deploy Leo CDP

SSH_KEY="/Users/mac/.ssh/mumbai.pem"


# local in dev machine

LOCAL_GEOIP_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/data/GeoIP2-City-Asia-Pacific.mmdb"

LOCAL_CONFIG_FOLDER="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/configs"
LOCAL_RESOURCES_FOLDER="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/resources"
LOCAL_PUBLIC_FOLDER="/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/public"


# remote path

REMOTE_FOLDER="/build/leocdp/"

REMOTE_CONFIG_FOLDER="/build/leocdp/configs"
REMOTE_RESOURCES_FOLDER="/build/leocdp/resources"
REMOTE_PUBLIC_FOLDER="/build/leocdp/public"

# server list

SERVER_DEMO="ubuntu@demo.leocdp.net"


echo "---- BEGIN SYNCH STATIC FILES $LOCAL_FOLDER to $REMOTE_FOLDER "

# SERVER_DEMO ###############################################################

echo "-------- $SERVER_DEMO at $(date) ------------- \n"

scp -i $SSH_KEY $LOCAL_GEOIP_FILE $SERVER_DEMO:$REMOTE_FOLDER

scp -i $SSH_KEY -r $LOCAL_CONFIG_FOLDER $SERVER_DEMO:$REMOTE_CONFIG_FOLDER
scp -i $SSH_KEY -r $LOCAL_RESOURCES_FOLDER $SERVER_DEMO:$REMOTE_RESOURCES_FOLDER
scp -i $SSH_KEY -r $LOCAL_PUBLIC_FOLDER $SERVER_DEMO:$REMOTE_PUBLIC_FOLDER


echo "-------- Synch OK $SERVER_DEMO at $(date) ------------- \n"


echo "---- DONE ---- "
