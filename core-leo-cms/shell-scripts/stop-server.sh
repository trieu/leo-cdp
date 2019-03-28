#!/bin/sh

kill -15 $(pgrep -f server-1.0.jar)
sleep 1