/**
 * Created by trieu on 5/27/15.
 */
module.exports = function(env) {
	var dbConfigs = require('./database');

	return {
        port: 3000,
		SALT: 'adsplay$123*&^mvc@#!',
		session: 48*60*60*1000, //2 day
		dbUrl: dbConfigs.url
	}
};