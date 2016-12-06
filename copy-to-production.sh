#!/bin/sh

cp -r adsplay-report/app.js ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/package.json ../adsplay-frontend/adsplay-admin/

cp -r adsplay-report/models/ ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/views/ ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/controllers/ ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/public/ ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/middlewares/ ../adsplay-frontend/adsplay-admin/
cp -r adsplay-report/helpers/ ../adsplay-frontend/adsplay-admin/
