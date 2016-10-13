/**
 * Created by trieu on 8/16/16.
 */
var config_authorization = {
    // enable roles 
    access: [
        {routes: '/creative/*', roles: ['*']}, //all roles and all method
        {routes: '/placement/*', roles: ['admin', 'operator']}, //roles admin and operator
        {routes: '/campaign/*', roles: ['*'], method: ['get', 'post']}, //with method get and post
        {routes: '/monitor/*', roles: ['*']},
        {routes: '/content/*', roles: ['*']},
        {routes: '/user-profile/*', roles: ['*']},
        {routes: '/booking/*', roles: ['*']},
        {routes: '/export/*', roles: ['*']},
    ],
    // disable roles
    denied: [
        {routes: '/creative/new/*', roles: ['client']},
    ]
};

module.exports = config_authorization;
