var request = require('request');
var moment = require('moment');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'search.adsplay.net:9201',
  log: 'trace'
});
var commonConfigs = require('./common.js')(NODE_ENV);
var params = require('../helpers/params_utils.js');
module.exports = function(app) {
  
  app.get('/api/search', function(req, res){
    client.search({
      index: 'revenue_search',
      type: 'rvn_media_table',
      body: {
        "query": {
          "match": {
            "video_title": req.query.video_title
          }
        }
      },
    }).then(function (body) {
      var hits = body.hits.hits;
      res.json(hits);
    }, function (error) {
      console.trace(error.message);
      res.json({});
    });

  });

  app.get('/api/ads-list', function(req, res){
      var end = new moment().format("YYYY-MM-DD");
      var begin = new moment().subtract(90, 'days').format("YYYY-MM-DD");
      var url = commonConfigs.domain.api + '/api/creative/summary?begin='+begin+'&end='+end;

      request(url ,function (err, response, body) {
            if(!err && response.statusCode == 200){
                var result = JSON.parse(body);
                var user = req.session.user;
                console.log(user)
                if(user.roles['superadmin']){
                  return res.json(result);
                }
                else{
                  console.log(user.rolesAds)
                  if(user.rolesAds){
                    var data = [];
                    for(var i in result){
                      if(user.rolesAds[parseInt(result[i].id)]){
                        data.push(result[i]);
                      }
                    }
                    return res.json(data);
                  }
                  return res.json([]);
                }
            }
            else{
                console.error(err);
                return res.json([]);
            }
        });

  });

  app.get('/api/ads-detail/:id', function(req, res){
      var url = commonConfigs.domain.api + '/api/creatives/'+req.params.id;
      request(url ,function (err, response, body) {
          if(!err && response.statusCode == 200){
              console.log(body)
             return res.json(JSON.parse(body));
          }
          else{
              console.error(err);
              return res.json({});
          }
      });

  });

  app.post('/api/update/status', function(req, res){
      var id = req.query.id;
      var status = req.query.status;
      var url = commonConfigs.domain.api + '/api/creatives/' + id;
      request.patch(url).form(JSON.stringify({status: status}));
      res.json({success: true});
  });

  // set user_info
  app.post('/callback', function(req, res) {
      var urlApp = req.protocol + '://' + req.get('host');
      var user_token = req.query.access_token || req.cookies['user_token'];
      if(user_token){
        request(commonConfigs.sso+'userinfo?access_token='+user_token, function (error, response, body) {
          //console.log(body)
          if(!error && response.statusCode == 200){
            var result = JSON.parse(body);
            console.log(result);
            req.session.user = result.user_info;
            // set cookie if need
            // res.cookie('user_info', JSON.stringify(result.user_info), { signed: false, encode: String, maxAge: commonConfigs.session });
            return res.json(result);
          }
          else{
            return res.json({success: false, redirect_uri: commonConfigs.sso+'login?redirect_uri='+urlApp});
          }
        });
      }
      else{
        return res.json({success: false, redirect_uri: commonConfigs.sso+'login?redirect_uri='+urlApp});
      }
  });

  // app.use((req, res, next) => {
  //   console.log(' ====== DEBUG ====== '); // DEBUG
  //   next();
  // });
  
  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
      res.sendFile('./public/layout.html', { root: __dirname + "/../../"});
  });

};
