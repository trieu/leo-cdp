var crawlerjs = require('crawler-js');
 
var worlds = {
  interval: 1000,
  get: 'http://getbootstrap.com/',
  preview: 1,
  extractors: [
    {
      selector: '.bs-docs-home',
      callback: function(err, html, url, response){
        console.log(html);
        console.log(url);
        // console.log(response); // If you need see more details about request 
        if(!err){
          data = {};

          data.world = html.find('a').attr('href');
          if(typeof data.world == 'undefined'){
            delete data.world;
          }
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}
 
crawlerjs(worlds);