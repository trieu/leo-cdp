module.exports = {
    "appenders": [
		{
			"type": "file",
            "absolute": true,
			"filename": "logs/error.log",
			"maxLogSize": 5*1024*1024, // = 5Mb
			"backups": 5,
			"level": "ERROR",
			"category": "adsplaylog"
		},
		{
			"type": "file",
            "absolute": true,
			"filename": "logs/debug.log",
			"maxLogSize": 5*1024*1024, // = 5Mb
			"backups": 5,
			"level": "DEBUG",
			"category": "adsplaylogdebug"
		}
	]
}