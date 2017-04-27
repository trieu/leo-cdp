module.exports = {
    privateKey: '6789ifadop#@$!',
    server: {
        host: 'id.adsplay.net',
        port: 4000
    },
    database: {
        host: 'localhost',
        port: 27017,
        db: 'fptoauth',
        url: 'mongodb://127.0.0.1:27017/fptoauth'
    },
    sessionExpiry: 3600000 * 24 * 2, //2 day
    tokenExpiry: 3600 * 2, //2 minutes
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
    //TODO
    email: {
        email: "adsplayfpt@gmail.com",
        password: "trieunguyen",
        accountName: "gmail",
        verifyEmailUrl: "verifyEmail"
    },
    oauth:{
		facebook: {
            clientID : 'your-secret-clientID-here', // your App ID
            clientSecret: 'your-client-secret-here', // your App Secret
            callbackURL: 'http://localhost:8080/auth/facebook/callback'
        }
    },

};