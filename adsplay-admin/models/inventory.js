var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var connection = mongoose.createConnection(dbConfig.url);

var predSchema = new mongoose.Schema({  
  pred_views :[
  {
    pred : { type: Number},
    time : { type: Date, default: Date.now() }
  }
  ],
  pfId : { type: Number},
  pred_range : { type: String},
  time : { type: Date, default: Date.now() }
});

module.exports = {
  predicted: mongoose.model('predicted_inventory', predSchema, 'predicted_inventory')
}

