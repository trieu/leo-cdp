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
    mediaDir : '/home/trieu/data/media'
    ,mediaTempDir : '/home/trieu/data/media/temp'
    ,authorization : config_authorization
};