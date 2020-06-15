#!/bin/sh
# This is script to deploy code to remote Server 
# ssh -i /Users/mac/.ssh/id_rsa_myaws ubuntu@52.71.136.239

IP_SERVER="52.71.136.239"
USERNAME="ubuntu"
SCP_PARAMS="-P 22 -i /Users/mac/.ssh/id_rsa_myaws"

DATA_OBSERVER_FILE="./BUILD-OUTPUT/leo-data-observer-1.0.jar"
MAIN_SYSTEM_FILE="./BUILD-OUTPUT/leo-main-starter-1.0.jar"

LOCAL_DEPS_FOLDER="./BUILD-OUTPUT/deps/"
LOCAL_CONFIGS_FOLDER="./BUILD-OUTPUT/configs/"
LOCAL_RESOURCES_FOLDER="./BUILD-OUTPUT/resources/"
LOCAL_PUBLIC_FOLDER="./BUILD-OUTPUT/public/"

REMOTE_FOLDER="/build/leocdp/"
REMOTE_DEPS_FOLDER="/build/leocdp/deps/"
REMOTE_CONFIGS_FOLDER="/build/leocdp/configs/"
REMOTE_RESOURCES_FOLDER="/build/leocdp/resources/"
REMOTE_PUBLIC_FOLDER="/build/leocdp/public/"

echo "Copy jar file with ALL DEPS LIBRARIES ?"
read CHECK

# SERVER_DEV ###############################################################
	
	SERVER_DEV="$USERNAME@$IP_SERVER"
	
	echo "-------- BEGIN SYNCH $LOCAL_FOLDER to $REMOTE_FOLDER at $(date) ------------- \n"
	
	scp $SCP_PARAMS $DATA_OBSERVER_FILE $SERVER_DEV:$REMOTE_FOLDER
	scp $SCP_PARAMS $MAIN_SYSTEM_FILE $SERVER_DEV:$REMOTE_FOLDER
	
	CHECK_RESULT=1
	if [ $CHECK -eq $CHECK_RESULT ]; then
		echo "COPY all DEPS "
		scp $SCP_PARAMS -r $LOCAL_DEPS_FOLDER $SERVER_DEV:$REMOTE_DEPS_FOLDER
	fi
	echo "-------- END SYNCH $SERVER_DEV at $(date) ------------- \n"

#########################################

# ssh $SCP_PARAMS $SERVER_DEV 'sudo bash -s' <  shell-scripts/restart-server.sh

echo "---- DONE ---- "

