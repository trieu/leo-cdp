#!/bin/sh

# Script a copy single file to remote server

SSH_KEY="/Users/mac/.ssh/mumbai.pem"

#LOCAL_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/resources/app-templates/leocdp-admin/common-resources/leocdp.segmentation.js"
#REMOTE_FOLDER="/build/leocdp/resources/app-templates/leocdp-admin/common-resources/"

LOCAL_FILE="/Users/mac/projects/leo-cms-framework/core-leo-cms/resources/app-templates/leocdp-admin/modules/analytics/marketing-dashboard.html"
REMOTE_FOLDER="/build/leocdp/resources/app-templates/leocdp-admin/modules/analytics/"

SERVER_NAME="ubuntu@demo.leocdp.net"

scp -i $SSH_KEY $LOCAL_FILE $SERVER_NAME:$REMOTE_FOLDER