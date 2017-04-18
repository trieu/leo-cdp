module.exports = {
    privateKey: '6789jifdeop',
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
    tokenExpiry: 1000 * 60 * 60 * 2, //2 hour
    email: {
        email: "adsplayfpt@gmail.com",
        password: "trieunguyen",
        accountName: "gmail",
        verifyEmailUrl: "verifyEmail"
    },
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
    oauth:{
		facebook: {
            clientID : 'your-secret-clientID-here', // your App ID
            clientSecret: 'your-client-secret-here', // your App Secret
            callbackURL: 'http://localhost:8080/auth/facebook/callback'
        }
    },

};