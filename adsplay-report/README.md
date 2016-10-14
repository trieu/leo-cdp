AdsPlay - adsplay-report
====================

monitoring, reporting, automatically reacts to critical values of metrics

## Usage
`With node`

1. `npm run product` 

2. `npm start` //dev

3. `npm run compress` //compress js vs css

`With PM2`

1. `sudo pm2 start npm --name "adsplay-admin" -- run product`

2. `sudo pm2 start npm --name "adsplay-admin" -- start` //dev


Refer Links for the Graph Data Visualization:
====================
https://jsfiddle.net/kaLt5aqr/
http://bl.ocks.org/mostaphaRoudsari/b4e090bb50146d88aec4
http://bl.ocks.org/dbuezas/9306799
http://codepen.io/andreic/pen/CJoze

Core Contributors:
====================
	TrieuNT@fpt.com.vn
	

Core Contributors:
====================
	allgame789@gmail.com

USE : upload helper
var upload = require('../helpers/upload_utils.js');
call function

upload.rename(string); // remove all unicode + space --> return : new file name 

upload.folder(output); // create folder if doesn't exist --> return : path

upload.video(link, callback); // upload video local --> return : json info video

upload.ftp_video(link, callback); // upload video on ftp --> return : json info video ftp

upload.image(link, callback); // upload image local --> return : json info image

upload.unzip(link, callback); // upload zip html and unzip --> return : json info html 

--------------------------

video upload 
step 1: 
user interface -> click save

step 2: 
handling -> router creative/save
			-> check admin , check type video

step 3:
check true -> upload video on local (function upload_video) -> return json (filename, url, size)
				-> upload success -> upload ftp (function ftp_storage) -> return json (filename, url, size)

