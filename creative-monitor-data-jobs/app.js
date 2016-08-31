var dbConfig = require('./configs/database');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.local);

require('./controllers/flighting.js'); //load schedule
require('./configs/refresh.js'); //refresh schedule