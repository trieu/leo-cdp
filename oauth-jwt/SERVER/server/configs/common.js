module.exports = {
    privateKey: 'ha!@#$%fpt6789',
    server: {
        host: 'localhost',
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
        username: "adsplayfpt",
        email: "adsplayfpt@gmail.com",
        password: "trieunguyen",
        roles: ["admin","super"]
    },
    recaptcha:{
        siteKey: "6LfDchYUAAAAAGb0F37R3Ui3KWEZQJ97B8bzGVeo",
        secretKey: "6LfDchYUAAAAAAEtC3-XcBXksTaVgBcf6mxWm_Oh",
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