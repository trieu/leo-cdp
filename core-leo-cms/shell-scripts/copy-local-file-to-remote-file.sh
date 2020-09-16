#!/bin/sh

# Script a copy single file to remote server

SSH_KEY="/Users/mac/.ssh/mumbai.pem"

LOCAL_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/public/js/leo-observer/leoform.js"
REMOTE_FOLDER="/build/leocdp/public/js/leo-observer/leoform.js"

SERVER_NAME1="ubuntu@demo.leocdp.net"
scp -i $SSH_KEY $LOCAL_FILE $SERVER_NAME1:$REMOTE_FOLDER

SERVER_NAME2="ubuntu@demotrack.leocdp.net"
scp -i $SSH_KEY $LOCAL_FILE $SERVER_NAME2:$REMOTE_FOLDER