#!/bin/sh
#  This is script to deploy code to remote Server 

CHECK_RESULT=1

echo "Copy DELIVERY jar file with ALL DEPS LIBRARIES ?"
read CHECK

SERVER_FILE="./BUILD-OUTPUT/content-api-server-1.0.jar"
LOCAL_FOLDER="./BUILD-OUTPUT/deps/"

REMOTE_FOLDER="/build/leo-cms-server/"
REMOTE_DEPS_FOLDER="/build/ad-server/deps/"

SERVER_D1="admin@delivery1"

echo "---- BEGIN SYNCH $LOCAL_FOLDER to $REMOTE_FOLDER "

# SERVER_D1 ###############################################################
echo "-------- $SERVER_D1 at $(date) ------------- \n"
scp -P 234 $ADSERVER_FILE $SERVER_D1:$REMOTE_FOLDER
scp -P 234 $ADMODEL_FILE $SERVER_D1:$REMOTE_DEPS_FOLDER
if [ $CHECK -eq $CHECK_RESULT ]; then
	echo "COPY all deps"
	scp -P 234 -r $LOCAL_FOLDER $SERVER_D1:$REMOTE_FOLDER
fi
echo "-------- Synch OK $SERVER_D1 at $(date) ------------- \n"



#########################################

#### ssh -p 228 $SERVER41 'sudo bash -s' <  shell-scripts/restart-server.sh

echo "---- DONE ---- "

