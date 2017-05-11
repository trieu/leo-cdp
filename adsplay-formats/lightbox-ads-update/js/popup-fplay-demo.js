
// ------------------------------ LightBoxAds ----------------------------------------//
(function( $ ) {

    "use strict";

    $.LightBoxAds = function( el, options ) {
        var flag = 0;
        var uuid ;
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data( "LightBoxAds", base );

        $.LightBoxAds.defaultOptions = {
          linkApi: "https://d4.adsplay.net/delivery?uuid="+ AdsPlayUUID.getUUID() +"&placement=1010&at=tvc",
          classWrapp: "wrappVideo",
          idVideo: "idVideo",
          srcThumbnail: "images/lightbox_thumbnail.png",
          showCloseThumbnail: true,
          showClosePopup: true,
          autoHideThumbnail: true,
          timeShow: 3000,
          timeHide: 30,
          classVideoAds: 'classVideoAds',
          classYoutubeAds: 'classYoutubeAds',
          idVideoAds: 'idVideoAds',
          setTimeLogEvent: 5000
          
        };
        /*======================Init====================================*/
        /*init main*/
        base.init = function() {

          base.options = $.extend( {},$.LightBoxAds.defaultOptions, options );
          base.run( base.options.timeShow, base.options.timeHide );
            
        };
        /*init thumbnail*/
        base.thumbnail = function() {
          var divThumbnail = $('<div class="classThumbnail"></div>');
          var srcThumbnail = $('<img src="'+ base.options.srcThumbnail +'" alt="Image error"/>');
                divThumbnail.html(srcThumbnail);
               
                base.$el.append(divThumbnail);
          
        }
        /*init close thumbnail*/
        base.closeThumbnail = function() {

          if( base.options.showCloseThumbnail === true ) {
            var divClose = $('<div class="classClose"></div>');
            var buttonCloseThumbnail = $('<span class="buttonCloseThumbnail">×</span>');
            divClose.html(buttonCloseThumbnail);
            base.$el.append(divClose);
          }
          
        }
        /*init close Popup*/
        base.closePopup = function() {

          if( base.options.showClosePopup === true ) {
            var divClose = $('<div class="classClosePopup"></div>');
            var buttonClosePopup = $('<span class="buttonClosePopup">×</span>');
              divClose.html(buttonClosePopup);
              
              base.$el.append(divClose);
          }
          
        }

        base.videoPopup = function() {
          // var link = base.options.linkApi ;
          // var linkMediaYouTuBe = link.split('=');
          // console.log(linkMediaYouTuBe)
          $.ajax({
              url: base.options.linkApi ,
              dataType: 'xml',
              success: function(data) {
               
                var linkMedia = $(data).find('MediaFile').text();
                // var uuid = base.getUUID();
                console.log(base.options.linkApi );
                if ( linkMedia.indexOf( "youtu.be" ) >= 0 || linkMedia.indexOf( "youtube" ) >= 0 ) {
                  var divClass = $('<div class="'+ base.options.classVideoAds +'"></div>');
                  var linkMediaYouTuBe = linkMedia.split('=')[1];
                  // console.log(typeof linkMediaYouTuBe)
                  var youtube = '<iframe  class="' + base.options.classYoutubeAds + '" src="https://www.youtube.com/embed/'+ linkMediaYouTuBe +'?rel=0&autoplay=1&showinfo=0&controls=0"></iframe>';
                     var tempClass = divClass.append(youtube);
                   base.$el.append(tempClass);
                   setTimeout(function() {
                      $("." + base.options.classVideoAds);
                      base.VideoAdDone();
                   }, 30000);

                }else {
                    var divClass = $('<div class="'+ base.options.classVideoAds +'"></div>');
                    
                    var video = $( '<video class="video-js" id="'+ base.options.idVideoAds+'"  autoplay controls preload="auto"><source src="'+ linkMedia +'" type="video/mp4" /></video>' );

                      var tempClass = divClass.append(video);
                       base.$el.parent().append(tempClass);

                       var videoEnd = videojs("#"+ base.options.idVideoAds).ready(function(){
                          var player = this;
                            player.on('ended', function() {
                              base.VideoAdDone();
                          });
                        });
                }

                base.logEventStart();
                setTimeout(base.logEventCreativeView, 100);
                setTimeout(base.logImpression, 1000);
                setTimeout(base.logEventMidpoint, 7000);
                setTimeout(base.logEventComplete, 15000);

              },
              error: function() {
                alert("error");
              }
          }); 

        }
        
        /*====================event=============================*/
        /*event button close Thumbnail*/
        base.clickClose = function() {
          $(".classClose").bind('click', function(){
            $(".classClose").detach();
            $(".classThumbnail").detach();
           
          });
        }
        
        /*event auto hide thumbnail*/
        base.autoHideThumbnail = function() {
          if( base.options.autoHideThumbnail === true ) {
            $(".classClose").detach();
            $(".classThumbnail").detach();
          }
            
        }

        /*event of video after click thumbnail*/
        base.videoAfterClickThumbnail = function() {
          
          $( '.'+ base.options.classWrapp +' '+ 'video' ).prop( { "muted" : true } );
          videojs( base.options.idVideo ).pause();
        }

        /*event button close popup*/
        base.clickClosePopup = function() {
          $(" .classClosePopup ").bind('click', function() {
            $(' .classClosePopup ').detach();
            $('.'+ base.options.classVideoAds ).detach();
            $( '.'+ base.options.classWrapp +' '+ 'video' ).prop( { "muted" : false } );
            videojs( base.options.idVideo ).play();
            base.logEventClose();
            // base.options.haveClickClosePopup = true;
            // flag = 1;
          });
        }

        /*Video popup play done*/
        base.VideoAdDone = function() {
            $(' .classClosePopup ').detach();
            $('.'+ base.options.classVideoAds ).detach();
            $( '.'+ base.options.classWrapp +' '+ 'video' ).prop( { "muted" : false } );
            videojs( base.options.idVideo ).play();
            base.logEventClose();
        }

        /*event click into thumbnail*/
        base.clickThumbnail = function() {

          $(" .classThumbnail ").bind('click', function(){
              //muted and pause video
              base.videoAfterClickThumbnail();
              //Remove thumbnail and button close
              $(".classClose").detach();
              $(".classThumbnail").detach();
              //create video
              base.videoPopup();
              
              //create button close Popup
              base.closePopup();
              //event when click button ClosePopup
              base.clickClosePopup();

          });

          
        }

        base.run = function( timeShow, timeHide ) {
            
          setTimeout(function() {


            base.show();

            var countDown = setInterval( function() {

                  timeHide -= 1;
                  if ( timeHide <= 0 ) {
                    base.hide(); 
                    return clearInterval( countDown );
                  }

            }, 1000 );

          }, timeShow );
            
        }
        base.logImpression = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
                var linkMedia = $(data).find('MediaFile').text();
                  


                var arrayUrl = [];
                $(data).find('Impression').each(function(){
         
                      var name = $(this).text();
                      arrayUrl.push(name);
                 
                });
                console.log("3 - Impression");
                console.log(arrayUrl);
                for( var i = 0 ; i< arrayUrl.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrl[i],
                    vars : {},
                    noParameter : true
                  });

                }




                
                  
              },
              error: function() {
                alert("error");
              }
          }); 

        }
        base.logEventComplete = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
               var arrayUrlEvent = [];
                $(data).find('Tracking[event="complete"]').each(function(){
         
                      var name = $(this).text();
                      arrayUrlEvent.push(name);
                 
                });
                console.log(" 5 - EventComplete")
                console.log(arrayUrlEvent)

                for( var i = 0 ; i< arrayUrlEvent.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrlEvent[i],
                    vars : {},
                    noParameter : true
                  });

                }
                
                  
              },
              error: function() {
                alert("error");
              }
          });   

        }

        base.logEventMidpoint = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
               var arrayUrlEvent = [];
                $(data).find('Tracking[event="midpoint"]').each(function(){
         
                      var name = $(this).text();
                      arrayUrlEvent.push(name);
                 
                });
                console.log(" 4- EventMidpoint")
                console.log(arrayUrlEvent)

                for( var i = 0 ; i< arrayUrlEvent.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrlEvent[i],
                    vars : {},
                    noParameter : true
                  });

                }
                
                  
              },
              error: function() {
                alert("error");
              }
          });   

        }

        base.logEventStart = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
               var arrayUrlEvent = [];
                $(data).find('Tracking[event="start"]').each(function(){
         
                      var name = $(this).text();
                      arrayUrlEvent.push(name);
                 
                });
                console.log("1 - EventStart")
                console.log(arrayUrlEvent)

                for( var i = 0 ; i< arrayUrlEvent.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrlEvent[i],
                    vars : {},
                    noParameter : true
                  });

                }
                
                  
              },
              error: function() {
                alert("error");
              }
          });   

        }

        base.logEventClose = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
               var arrayUrlEvent = [];
                $(data).find('Tracking[event="close"]').each(function(){
         
                      var name = $(this).text();
                      arrayUrlEvent.push(name);
                 
                });
                console.log(" 6 - EventClose")
                console.log(arrayUrlEvent)

                for( var i = 0 ; i< arrayUrlEvent.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrlEvent[i],
                    vars : {},
                    noParameter : true
                  });

                }
                
                  
              },
              error: function() {
                alert("error");
              }
          });   

        }

        base.logEventCreativeView = function() {

          $.ajax({
              url: base.options.linkApi,
              dataType: 'xml',
              success: function(data) {
               
               var arrayUrlEvent = [];
                $(data).find('Tracking[event="complete"]').each(function(){
         
                      var name = $(this).text();
                      arrayUrlEvent.push(name);
                 
                });
                console.log(" 2 - EventCreativeView")
                console.log(arrayUrlEvent)

                for( var i = 0 ; i< arrayUrlEvent.length; i++) {
                  // log click
                  base.callBeaconLogTracking({
                    url : arrayUrlEvent[i],
                    vars : {},
                    noParameter : true
                  });

                }
                
                  
              },
              error: function() {
                alert("error");
              }
          });   

        }
        base.callBeaconLogTracking = function(opts) {

          // Make sure we have a base object for opts
            opts = opts || {};
            // Setup defaults for options
            opts.url = opts.url || null;
            opts.vars = opts.vars || {};
            opts.error = opts.error || function() {};
            opts.success = opts.success || function() {};
            
            //cache busting
            if( opts.url.indexOf('?') < 0 ){
              opts.vars.cb = Math.floor(Math.random() * 10e12);  
            }
            
            
            // Split up vars object into an array
            var varsArray = [];
            for ( var key in opts.vars) {
              varsArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(opts.vars[key]));
            }
            
            // Build query string
            var qString = varsArray.join('&');      
        
            // Create a beacon if a url is provided
            if (opts.url) {
              // Create a brand NEW image object
              var beacon = new Image();
              // Attach the event handlers to the image object
              if (beacon.onerror) {
                beacon.onerror = opts.error;
              }
              if (beacon.onload) {
                beacon.onload = opts.success;
              } 
              // Attach the src for the script call
              if(opts.noParameter){
                beacon.src = opts.url;
              } else {
                beacon.src = opts.url + '?' + qString;
              }       
            }

        }
        base.show = function() {
          //call thumbnail
          base.thumbnail();
          //event when click thumbnail
          base.clickThumbnail();
          //call button closeThumbnail
          base.closeThumbnail();
          //event when click button Close
          base.clickClose();

        }
          
        base.hide = function() {
          
          // auto hide thumbnail about seconds
          base.autoHideThumbnail();

        }
         
        base.init();

    };

    $.fn.LightBoxAds = function( options ) {

        return this.each( function() {
             new $.LightBoxAds( this, options );
        });

    };

})( jQuery );

        
  




// ------------------------------ AdsPlayCookies ----------------------------------------//
(function(global, undefined) {
  'use strict';

  var factory = function(window) {
    if (typeof window.document !== 'object') {
      throw new Error(
          'AdsPlayCookies.js requires a `window` with a `document` object');
    }

    var AdsPlayCookies = function(key, value, options) {
      return arguments.length === 1 ? AdsPlayCookies.get(key)
          : AdsPlayCookies.set(key, value, options);
    };

    // Allows for setter injection in unit tests
    AdsPlayCookies._document = window.document;

    // Used to ensure cookie keys do not collide with
    // built-in `Object` properties
    AdsPlayCookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

    AdsPlayCookies._maxExpireDate = new Date(
        'Fri, 31 Dec 9999 23:59:59 UTC');

    AdsPlayCookies.defaults = {
      path : '/',
      secure : false
    };

    AdsPlayCookies.get = function(key) {
      if (AdsPlayCookies._cachedDocumentCookie !== AdsPlayCookies._document.cookie) {
        AdsPlayCookies._renewCache();
      }

      return AdsPlayCookies._cache[AdsPlayCookies._cacheKeyPrefix + key];
    };

    AdsPlayCookies.set = function(key, value, options) {
      options = AdsPlayCookies._getExtendedOptions(options);
      options.expires = AdsPlayCookies
          ._getExpiresDate(value === undefined ? -1 : options.expires);

      AdsPlayCookies._document.cookie = AdsPlayCookies
          ._generateAdsPlayCookiestring(key, value, options);

      return AdsPlayCookies;
    };

    AdsPlayCookies.expire = function(key, options) {
      return AdsPlayCookies.set(key, undefined, options);
    };

    AdsPlayCookies._getExtendedOptions = function(options) {
      return {
        path : options && options.path || AdsPlayCookies.defaults.path,
        domain : options && options.domain
            || AdsPlayCookies.defaults.domain,
        expires : options && options.expires
            || AdsPlayCookies.defaults.expires,
        secure : options && options.secure !== undefined ? options.secure
            : AdsPlayCookies.defaults.secure
      };
    };

    AdsPlayCookies._isValidDate = function(date) {
      return Object.prototype.toString.call(date) === '[object Date]'
          && !isNaN(date.getTime());
    };

    AdsPlayCookies._getExpiresDate = function(expires, now) {
      now = now || new Date();

      if (typeof expires === 'number') {
        expires = expires === Infinity ? AdsPlayCookies._maxExpireDate
            : new Date(now.getTime() + expires * 1000);
      } else if (typeof expires === 'string') {
        expires = new Date(expires);
      }

      if (expires && !AdsPlayCookies._isValidDate(expires)) {
        throw new Error(
            '`expires` parameter cannot be converted to a valid Date instance');
      }

      return expires;
    };

    AdsPlayCookies._generateAdsPlayCookiestring = function(key, value,
        options) {
      key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
      key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
      value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g,
          encodeURIComponent);
      options = options || {};

      var AdsPlayCookiestring = key + '=' + value;
      AdsPlayCookiestring += options.path ? ';path=' + options.path : '';
      AdsPlayCookiestring += options.domain ? ';domain=' + options.domain
          : '';
      AdsPlayCookiestring += options.expires ? ';expires='
          + options.expires.toUTCString() : '';
      AdsPlayCookiestring += options.secure ? ';secure' : '';

      return AdsPlayCookiestring;
    };

    AdsPlayCookies._getCacheFromString = function(documentCookie) {
      var cookieCache = {};
      var AdsPlayCookiesArray = documentCookie ? documentCookie
          .split('; ') : [];

      for (var i = 0; i < AdsPlayCookiesArray.length; i++) {
        var cookieKvp = AdsPlayCookies
            ._getKeyValuePairFromAdsPlayCookiestring(AdsPlayCookiesArray[i]);

        if (cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
          cookieCache[AdsPlayCookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
        }
      }

      return cookieCache;
    };

    AdsPlayCookies._getKeyValuePairFromAdsPlayCookiestring = function(
        AdsPlayCookiestring) {
      // "=" is a valid character in a cookie value according to RFC6265,
      // so cannot `split('=')`
      var separatorIndex = AdsPlayCookiestring.indexOf('=');

      // IE omits the "=" when the cookie value is an empty string
      separatorIndex = separatorIndex < 0 ? AdsPlayCookiestring.length
          : separatorIndex;

      return {
        key : decodeURIComponent(AdsPlayCookiestring.substr(0,
            separatorIndex)),
        value : decodeURIComponent(AdsPlayCookiestring
            .substr(separatorIndex + 1))
      };
    };

    AdsPlayCookies._renewCache = function() {
      AdsPlayCookies._cache = AdsPlayCookies
          ._getCacheFromString(AdsPlayCookies._document.cookie);
      AdsPlayCookies._cachedDocumentCookie = AdsPlayCookies._document.cookie;
    };

    AdsPlayCookies._areEnabled = function() {
      var testKey = 'AdsPlayCookies.js';
      var areEnabled = AdsPlayCookies.set(testKey, 1).get(testKey) === '1';
      AdsPlayCookies.expire(testKey);
      return areEnabled;
    };

    AdsPlayCookies.enabled = AdsPlayCookies._areEnabled();

    return AdsPlayCookies;
  };

  var AdsPlayCookiesExport = typeof global.document === 'object' ? factory(global)
      : factory;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return AdsPlayCookiesExport;
    });
    // CommonJS/Node.js support
  } else if (typeof exports === 'object') {
    // But always support CommonJS module 1.1.1 spec (`exports` cannot be a
    // function)
    exports.AdsPlayCookies = AdsPlayCookiesExport;
  } else {
    global.AdsPlayCookies = AdsPlayCookiesExport;
  }
})(typeof window === 'undefined' ? this : window);




// ------------------------------ AdsPlayUUID ----------------------------------------//
(function(global, undefined) {
  'use strict';

  var factory = function(window) {
    if (typeof window.document !== 'object') {
      throw new Error(
          'AdsPlayUUID.js requires a `window` with a `document` object');
    }

    var AdsPlayUUID = function() {
      return AdsPlayUUID.getUUID();
    };

    // Allows for setter injection in unit tests
    AdsPlayUUID._document = window.document;

    // Used to ensure cookie keys do not collide with
    // built-in `Object` properties
    

    AdsPlayUUID.generateUUID = function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g,
          function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
      return uuid;
    };


    AdsPlayUUID.getUUID = function() {
       var key = 'apluuid';
        var uuid = AdsPlayCookies.get(key);
        if (!uuid) {
          uuid = AdsPlayUUID.generateUUID();
          AdsPlayCookies.set(key, uuid, {
            expires : 315569520
          }); // Expires in 10 years
        }
        return uuid;
    };

    return AdsPlayUUID;
  };

  var AdsPlayUUIDExport = typeof global.document === 'object' ? factory(global)
      : factory;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return AdsPlayUUIDExport;
    });
    // CommonJS/Node.js support
  } else if (typeof exports === 'object') {
    // But always support CommonJS module 1.1.1 spec (`exports` cannot be a
    // function)
    exports.AdsPlayUUID = AdsPlayUUIDExport;
  } else {
    global.AdsPlayUUID = AdsPlayUUIDExport;
  }
})(typeof window === 'undefined' ? this : window);


/*init plugin*/


$(".example-video-container").LightBoxAds({
        
      
        idVideo: "my-video",//id video
       
   
});

    

    

    

    

    






            