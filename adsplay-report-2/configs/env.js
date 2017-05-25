var COMMON = require('./common.js');

module.exports = exports = function(process) {
    return {
        ENV: process.NODE_ENV || "pro",
        HOST: process.NODE_HOST || COMMON.HOST,
        PORT: process.NODE_PORT || COMMON.PORT
    }
};
