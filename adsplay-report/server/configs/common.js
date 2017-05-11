/**
 * Created by trieu on 5/27/15.
 */
module.exports = function(env) {
	var dbConfigs = require('./database');

	return {
        port: 9881,
                SALT: 'adsplay$123*&^mvc@#!',
                session: 48*60*60*1000, //2 day
                dbUrl: dbConfigs.url,
                sso: 'http://id.adsplay.net/',
        }

};
