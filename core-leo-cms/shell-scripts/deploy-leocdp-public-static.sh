#!/bin/sh
#  This is script to deploy public static files

SSH_KEY="/Users/mac/.ssh/mumbai.pem"


# local in dev machine


LOCAL_PUBLIC_FOLDER="/Users/mac/projects/leo-cms-framework/core-leo-cms/public"


# remote path

REMOTE_PUBLIC_FOLDER="/build/leocdp/public"

# server list

SERVER_DEMO_STATIC="ubuntu@demostatic.leocdp.net"


echo "---- BEGIN SYNCH PUBLIC STATIC FILES $LOCAL_FOLDER to $REMOTE_FOLDER "


# SERVER_DEMO ###############################################################

echo "-------- $SERVER_DEMO at $(date) ------------- \n"


scp -i $SSH_KEY -r $LOCAL_PUBLIC_FOLDER $SERVER_DEMO_STATIC:$REMOTE_PUBLIC_FOLDER


echo "-------- Synch OK $SERVER_DEMO at $(date) ------------- \n"


echo "---- DONE ---- "
