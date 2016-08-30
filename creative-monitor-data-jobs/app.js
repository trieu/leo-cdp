var dbConfig = require('./configs/database');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.local);

// var schedule = require('node-schedule');
 
// var every_5s = schedule.scheduleJob('*/5 * * * * *', function(){
//   console.log('*/5 * * * * * - runs every 5 seconds');
// });

// var every_1m = schedule.scheduleJob('0 */1 * * * *', function(){
//   console.log('0 */1 * * * * - runs every 1 minute');
// });


require('./controllers/flighting.js'); //load schedule