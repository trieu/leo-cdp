module.exports = {
    privateKey: '6789ifadop#@$!',
    server: {
        host: 'id.adsplay.net',
        port: 8301
    },
    //localhost
    // database: {
    //     host: 'localhost',
    //     port: 27017,
    //     db: 'adsplay_id',
    //     url: 'mongodb://127.0.0.1:27017/adsplay_id'
    // },
    //server
    database: {
        host: '118.69.190.46',
        port: 11492,
        db: 'adsplay_id',
        url: 'mongodb://118.69.190.46:11492/adsplay_id'
    },
    sessionExpiry: 1000 * 60 * 60 * 24 * 2, //2 day
    tokenExpiry: 60 * 60 * 2, //2h
    superuser:{
        _id: 0,
        roles: {"superadmin" : true},
        username: "adsplayfpt",
        email: "adsplayfpt@gmail.com",
        password: "trieunguyen",
    },
    recaptcha:{
        siteKey: "6LfW_iUTAAAAAEinX_Pe_RVqZryKrDI5D1Jy237-",
        secretKey: "6LfW_iUTAAAAAM_U5Ia77l2ifg9uI7OlZCOzEKMB",
        ssl: true
    },
   domain:{
        api: 'http://api.adsplay.net',
        api_ssl: 'https://api.adsplay.net',
    },
    //TODO
    email: {
        email: "adsplayfpt@gmail.com",
        password: "trieunguyen",
        accountName: "gmail",
        verifyEmailUrl: "verifyEmail"
    },
    oauth:{
	facebook: {
            clientID : 'abcv', // your App ID
            clientSecret: 'abc', // your App Secret
            callbackURL: 'http://localhost:8080/auth/facebook/callback'
        }
    },

};
