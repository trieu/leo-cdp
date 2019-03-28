#!/bin/sh

gradle BuildApp
gradle CopyConfig
gradle CopyRuntimeLibs
gradle CopyShellScripts

echo "\n !!!!! BUILD DONE !!!!! \n"