#!/bin/sh
JVM_PARAMS="-Xms1G -Xmx2G -XX:+TieredCompilation -XX:+UseCompressedOops -XX:+DisableExplicitGC -XX:+UseNUMA -server"
JAR_MAIN="leocms-main-starter-1.0.jar"
JAR_UPLOADER="leocms-upload-file-starter-1.0.jar"

cd /build/leocms/

kill -15 $(pgrep -f "leocms-")
sleep 3

/usr/bin/java -jar $JVM_PARAMS $JAR_MAIN  >> /dev/null 2>&1 &
/usr/bin/java -jar $JVM_PARAMS $JAR_UPLOADER >> /dev/null 2>&1 &
