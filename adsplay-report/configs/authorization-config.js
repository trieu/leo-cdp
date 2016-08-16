/**
 * Created by trieu on 8/16/16.
 */
var config_authorization = {
    // enable roles
    access: [
        {routes: '/creative/*', roles: ['*']}, //all roles and all method
        {routes: '/placement/*', roles: ['admin', 'operator']}, //roles admin and operator
        {routes: '/campaign/*', roles: ['admin', 'operator'], method: ['get', 'post']}, //with method get and post
        {routes: '/monitor/*', roles: ['admin', 'operator']},
        {routes: '/content/*', roles: ['admin', 'operator']},
        {routes: '/user-profile/*', roles: ['admin', 'operator']},
        {routes: '/booking/*', roles: ['admin', 'operator']},
    ],
    // disable roles
    denied: [
        {routes: '/creative/new/*', roles: ['operator','client']},
    ]
};

module.exports = {
    authorization : config_authorization
};