#!/bin/sh

cd /build/mediaplayer

kill -9 $(pgrep -f "http-server -p 9090")
sleep 2

http-server -p 9090 >> /dev/null 2>&1 &


