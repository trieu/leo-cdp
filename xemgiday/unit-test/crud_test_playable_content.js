/**
 * Created by trieu on 2/20/16.
 */

var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);


var dbCon = mongoose.connection;
dbCon.on('error', console.error.bind(console, 'connection error:'));
dbCon.once('open', function() {
    console.log("we're connected!");
});
dbCon.once('close', function() {
    console.log("we're closed!");
});


var PlayableContent = require('../models/playable_content');

var pc1 = new PlayableContent();
pc1.title = "One Day 2011";
pc1.source = 1;//YouTube
pc1.description = "Bộ phim lãng mạn có sự tham gia của Anne Hathaway và Jim Sturgess sẽ đem tới cho khán giả những khoảnh khắc ngọt ngào trong dịp Valentine.";
pc1.thumbnail = "http://img.youtube.com/vi/HCiYTBxApwM/mqdefault.jpg";
pc1.tags = ["Valentine Movie"];
pc1.playUrl = "https://www.youtube.com/embed/HCiYTBxApwM";
pc1.playId = "HCiYTBxApwM";
pc1.socialScore = 99;
pc1.analyticStats.push({totalView:19});
pc1.save();

PlayableContent.find(function (err, list) {
    if (err) return console.error(err);
    console.log(list);

//    PlayableContent.remove({ playUrl: "https://www.youtube.com/embed/HCiYTBxApwM" }, function(err) {
//        if (!err) {
//            console.log('delete ok');
//        }
//        else {
//            console.log(err);
//        }
//    });
})



