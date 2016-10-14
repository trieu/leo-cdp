/**
 * Created by trieu on 5/27/15.
 */
module.exports = function(env) {
	var suffix = (env == 'dev') ? '' : '-'+env;

	var siteConfigs = require('./site'+suffix);
	var dbConfigs = require('./database');
	var authorizationConfigs = require('./authorization-config');

	return {
		siteConfigs: siteConfigs,
		dbConfigs: dbConfigs,
		authorizationConfigs: authorizationConfigs
	}
};