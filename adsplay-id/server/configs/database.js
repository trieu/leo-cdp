const Mongoose = require('mongoose')
const Common = require('./common')

Mongoose.connect(Common.database.url);  
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

exports.db = db;