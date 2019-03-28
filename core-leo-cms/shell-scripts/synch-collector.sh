!/bin/sh
# This is script to deploy EVENT COLLECTOR HTTP Server 

CHECK_RESULT=1

echo "Copy EVENT COLLECTOR jar file with ALL DEPS LIBRARIES ?"
read CHECK

LOG_SERVER_FILE="./BUILD-OUTPUT/event-collector-server-2.0.jar"

LOCAL_FOLDER="./BUILD-OUTPUT/deps/"

REMOTE_FOLDER="/build/leo-cms-server/"

SERVER_C1="adminsys@collector1"


echo "---- BEGIN SYNCH $LOCAL_FOLDER to $REMOTE_FOLDER "

################################################################
echo "-------- $SERVER_C1 at $(date) ------------- \n"
scp -P 234 $LOG_SERVER_FILE $SERVER_C1:$REMOTE_FOLDER
scp -P 234 $ADMODEL_FILE $SERVER_C1:$REMOTE_FOLDER
if [ $CHECK -eq $CHECK_RESULT ]; then
	echo "COPY all deps"
	scp -P 234 -r $LOCAL_FOLDER $SERVER_C1:$REMOTE_FOLDER
fi
echo "-------- Synch OK $SERVER_C1 at $(date) ------------- \n"



## ssh -p 228 $SERVER41 'sudo bash -s' <  shell-scripts/restart-server-41.sh

echo "---- DONE ---- ";
exit 0