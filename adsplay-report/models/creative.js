/**
 * Created by trieu on 5/27/15.
 */

var redisClientUtils = require('../helpers/redis_client_utils');
var client = redisClientUtils.getRedisAdData();

var moment = require('moment');
var Sync = require('sync');
var dataUtils = require('../helpers/data_utils.js');
var constantUtils = require('../helpers/constant_utils');
var stringUtils = require('../helpers/string_utils');
var upload = require('../helpers/upload_utils');
var convert = require('../helpers/convert_utils');
var request = require('request');
var crypto = require('crypto');
var _ = require('underscore');

exports.list = function (url, data, callback) {

	Sync(function(){
		try{
			var result = dataUtils.request.sync(null, url);
            var filteredList = [];
            result.forEach(function (crt) {
                crt.name = crt.name || '-';
                if (crt.name === 'Default') {
                    crt.name = 'Default Creative';
                }
                // crt.runDate = crt.runDate || 'Jul 1, 2015 12:00:00 AM';
                // crt.expiredDate = crt.expiredDate || 'Jul 21, 2015 12:00:00 AM';

                if (crt.runDate) {
                    var runDate = moment(crt.runDate, 'MMM D, YYYY hh:mm:ss A');
                    crt.runDate = runDate.format('YYYY-MM-DD');
                } else {
                    crt.runDate = 'N/A';
                }
                if (crt.expiredDate) {
                    var expiredDate = moment(crt.expiredDate, 'MMM D, YYYY hh:mm:ss A');
                    crt.expiredDate = expiredDate.format('YYYY-MM-DD');
                } else {
                    crt.expiredDate = 'N/A';
                }
                crt.active = crt.status == 2;
                crt.status = constantUtils.getStatus(crt.status);
                crt.ctr = (crt.ctr * 100).toFixed(2);
                crt.tvr = (crt.tvr * 100).toFixed(2);
                if (crt.totalRevenue == 0 || data.roles != 'admin') {
                    crt.totalRevenue = "-";
                }

                var adName = crt.name.toLowerCase();
                if (data.isAdminGroup) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1002 && adName.indexOf('vivid') >= 0) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1003 && adName.indexOf('fptplay') >= 0) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1004 && adName.indexOf('lava') >= 0) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1005 && adName.indexOf('ambient') >= 0) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1006 && adName.indexOf('itvad') >= 0) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1007 && (adName.indexOf('paytv') >= 0 )) {
                    filteredList.push(crt);
                }
                else if (data.ssid === 1009 && (adName.indexOf('panasonic') >= 0 )) {
                    filteredList.push(crt);
                }
		else if (data.ssid === 1008 && (adName.indexOf('startalk') >= 0 )) {
                    filteredList.push(crt);
                }

            });

			callback(null, filteredList);
		}

		catch (e) {
			console.error(e);
		}
		
	});

};

exports.detail = function (url, data, callback) {

	Sync(function(){
		try{
			var crt = dataUtils.request.sync(null, url);

			if (crt.crtDateL && crt.crtDateL > 0) {
                var createdDate = moment(crt.crtDateL);
                crt.crtDate = createdDate.format('YYYY-MM-DD, hh:mm a');
            }
            if (crt.runDateL && crt.runDateL > 0) {
                var runDate = moment(crt.runDateL);
                crt.runDate = runDate.format('YYYY-MM-DD, hh:mm a');
            }
            if (crt.expDateL && crt.expDateL > 0) {
                var expiredDate = moment(crt.expDateL);
                crt.expDate = expiredDate.format('YYYY-MM-DD, hh:mm a');
            }
            if (crt.totalRevenue == 0 || data.roles != 'admin') {
                crt.totalRevenue = "-";
            }
            crt.status = constantUtils.getStatus(crt.status);
            crt.nameType = constantUtils.getAdType(crt.adType);

            data.crt = crt;
            data.crtId = crt.id;
    		data.type = "daily";

            if (!data.begin || !data.end) {
                var end = moment();
                if (crt.expDateL > 0) {
                    var expMoment = moment(crt.expDateL);
                    if (end.isAfter(expMoment)) {
                        end = expMoment.add(1, 'days');
                    }
                }
                var begin = moment(crt.runDateL).subtract(1, 'days');

                data.begin = begin.format("YYYY-MM-DD");
                data.end = end.format("YYYY-MM-DD");
            }

			data.editUrl = '/creative/edit/' + crt.id; //link edit
			data.platforms = constantUtils.platforms; // get platform data
			data.placements = constantUtils.placements; //get placements data
			data.placements_default = constantUtils.placements_default;

			callback(null, data);
		}

		catch (e) {
			console.error(e);
		}
		
	});

};

exports.edit = function (url, data, callback) {

    Sync(function(){
        try{
            var crt = dataUtils.request.sync(null, url);

            if (crt.crtDateL && crt.crtDateL > 0) {
                crt.crtDate = new Date(crt.crtDateL).toISOString();
            }
            if (crt.runDateL && crt.runDateL > 0) {
                crt.runDate = new Date(crt.runDateL).toISOString();
            }
            if (crt.expDateL && crt.expDateL > 0) {
                crt.expDate = new Date(crt.expDateL).toISOString();
            }
            if (crt.totalRevenue == 0 || data.roles != 'admin') {
                crt.totalRevenue = "-";
            }
            data.crt = crt;
            data.crtId = crt.id;
            data.type = "daily";

            var end = moment();
            if (crt.expDateL > 0) {
                var expMoment = moment(crt.expDateL);
                if (end.isAfter(expMoment)) {
                    end = expMoment.add(1, 'days');
                }
            }
            var begin = moment(crt.runDateL).subtract(1, 'days');

            data.begin = begin.format("YYYY-MM-DD") || moment().subtract(1, 'days').format("YYYY-MM-DD");
            data.end = end.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");

            data.editUrl = '/creative/edit/' + crt.id; //link edit
            data.platforms = constantUtils.platforms; // get platform data
            data.placements = constantUtils.placements; //get placements data
            data.placements_default = constantUtils.placements_default;

            callback(null, data);
        }

        catch (e) {
            console.error(e);
        }
        
    });

};

exports.save = function (option, res, callback) {

    try{
        var crt = JSON.parse(option.fields.creative); //creative data
        var media = option.fields.media; //media string
        var file = option.files.media; //media file

        crt.adType = parseInt(option.adType);
        //crt.idUser = parseInt(option.user.id);

        crt.crtDateL = new Date().getTime();
        crt.runDateL = new Date(crt.runDate).getTime();
        crt.expDateL = new Date(crt.expDate).getTime();

        crt.createdDate = moment().format('YYYY-MM-DD-HH-mm');
        crt.runDate = moment(crt.runDate).format('YYYY-MM-DD-HH-mm');
        crt.expiredDate = moment(crt.expDate).format('YYYY-MM-DD-HH-mm');
        
        //remove field
        delete crt["expDate"];
        if(crt.id == ""){
            delete crt["id"];
        }

        if (crt.adType == 1 || crt.adType == 11) {
            save_tvc(option.url, crt, media, file, res);
        }
        else if (crt.adType == 3) {
            save_overlay(option.url, crt, media, file, res);
        }
        else if (crt.adType == 4) {
            save_break_news(option.url, crt, media, file, res);
        }
        else if (crt.adType == 5) {
            save_display_html(option.url, crt, media, file, res);
        }
        else if (crt.adType == 6) {
            save_display_image(option.url, crt, media, file, res);
        }
    }
    catch (e) {
        console.error(e);
    }
    
};

exports.update = function (url, body, res, callback) {
    
    if(!stringUtils.isEmpty(body)){
        request.patch(url).form(JSON.stringify(body));
        if(res != null){
            res.json({message: 'success'});
        }
    }
    else{
        if (res != null) {
            res.json({message: 'Error !!! request data'});
        }
    }
};

exports.metrics = function (url, data, callback) {

    Sync(function(){
        try{
            var crt = dataUtils.request.sync(null, url);
        
            crt.forEach(function (crt) {
                crt.name = crt.name || '-';
                if (crt.name === 'Default') {
                    crt.name = 'Default Creative';
                }
                crt.runDate = crt.runDate || 'Jul 1, 2015 12:00:00 AM';
                crt.expiredDate = crt.expiredDate || 'Jul 21, 2015 12:00:00 AM';

                var runDate = moment(crt.runDate, 'MMM D, YYYY hh:mm:ss A');
                crt.runDate = runDate.format('YYYY-MM-DD');
                var expiredDate = moment(crt.expiredDate, 'MMM D, YYYY hh:mm:ss A');
                crt.expiredDate = expiredDate.format('YYYY-MM-DD');
                crt.status = constantUtils.getStatus(crt.status);
                crt.ctr = (crt.ctr * 100).toFixed(2);
                crt.tvr = (crt.tvr * 100).toFixed(2);
            });

            data.crt = crt;
            data.end = moment().format("YYYY-MM-DD");
            data.begin = moment().subtract(30, 'days').format("YYYY-MM-DD");

            callback(null, data);
        }

        catch (e) {
            console.error(e);
        }
        
    });

};


// ------------- function extend
function youtubeValid(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

var convert_video = function(obj, crtName, callback){

    //convert and upload cdn
    var seedStr = stringUtils.removeUnicodeSpace(crtName) + (new Date()).getTime();
    var hash = crypto.createHash('md5').update(seedStr).digest('hex');
    var mediaName = hash + '.mp4';

    var input = obj.url;
    //output file convert with name = convert-video.mp4
    var output = obj.folder + "convert-video.mp4";
    var option = {videoCodec: 'libx264', audioCodec: 'aac', format: 'mp4', bitrate: '360p'}; //h.264 = libx264

    convert.command(input, output, option, function () {

        // output push on cdn
        upload.ftp_video(output, mediaName, function (data) {
            callback(mediaName);
        });

    });
}

var save_tvc = function(urlSave, crt, media, file, res){
    if(!_.isEmpty(file)){
        console.log('1 upload file');
        upload.video(file, function (obj) {
            //convert and upload cdn
            convert_video(obj, crt.name, function(mediaName){
                crt.media = mediaName;
                dataUtils.request_send_data(urlSave, crt, res);
            });
        });
    }
    else if(media != '' && youtubeValid(media)){
        console.log('2 upload youtube');
        upload.youtube(media, function (obj) {
            //convert and upload cdn
                convert_video(obj, crt.name, function(mediaName){
                    crt.media = mediaName;
                    dataUtils.request_send_data(urlSave, crt, res);
                });
            });
        
    }
    else{
        console.log('only data');
        dataUtils.request_send_data(urlSave, crt, res);
    }
}

var save_break_news = function(urlSave, crt, media, file, res){
    if(!_.isUndefined(media) && !_.isEmpty(media) && _.isString(media)){
        crt.media = media;
    }
    dataUtils.request_send_data(urlSave, crt, res);
};

var save_display_image = save_overlay = function(urlSave, crt, media, file, res){

    if(!_.isEmpty(file)){
        //rename image file
        var nameStr = file.name.split('.');
        var type = nameStr[nameStr.length-1];
        var seedStr = stringUtils.removeUnicodeSpace(file.name) + (new Date()).getTime();
        var hash = crypto.createHash('md5').update(seedStr).digest('hex');
        file.rename = hash +'.'+ type;

        console.log('upload file');
        upload.image(file, function (obj) {
            crt.media = obj.url;
            dataUtils.request_send_data(urlSave, crt, res);
        });
    }
    else{
        console.log('only data');
        dataUtils.request_send_data(urlSave, crt, res);
    }
};

var save_display_html = function(urlSave, crt, media, file, res){
    if(!_.isEmpty(file)){
        console.log('upload file');
        upload.unzip(file, function (obj){
            crt.media = obj.url;
            dataUtils.request_send_data(urlSave, crt, res);
        });
    }
    else{
        console.log('only data');
        dataUtils.request_send_data(urlSave, crt, res);
    }
};





