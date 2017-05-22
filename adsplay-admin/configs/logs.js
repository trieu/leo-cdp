module.exports = {
    "appenders": [
		{
			"type": "file",
            "absolute": true,
			"filename": "logs/error.log",
			"maxLogSize": 5*1024*1024, // = 5Mb
			"backups": 2,
			"level": "ERROR",
			"category": "adsplaylog"
		}
	]
}