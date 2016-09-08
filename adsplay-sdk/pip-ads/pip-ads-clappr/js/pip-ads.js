(function( $ ) {

    "use strict";

    $.pipAds = function( el, options ) {
     
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data( "pipAds", base );

        $.pipAds.defaultOptions = {
          
          idWrapp: 'videoWraper',
          idVideoContent: null,
          mutedContent: null,
          classTitle: 'title-ads',
          ContentTitle: null,
          classVideoAds: 'video-ads',
          idVideoAds: 'my-video-ads',
          link: null,
          type: null,
          classBannerAds: null,
          linkBannerAds: null,
          timeShow: 3000,
          timeHide: 10
          
        };
          
        base.init = function() {

          base.options = $.extend( {},$.pipAds.defaultOptions, options );
          base.cssContent();
          if( base.options.classBannerAds !== null || base.options.linkBannerAds !== null ) {

              var divBanner = $('<div class="'+ base.options.classBannerAds +'" style="display:none"></div>');
              var banner = $('<img src="'+ base.options.linkBannerAds +'"/>');

              var tempBanner = divBanner.append( banner );
              base.$el.append( tempBanner );

          }

          if( base.options.ContentTitle !== null) {
                 
              var divTitle = $('<div class="'+ base.options.classTitle +'" style="display:none"></div>');
              var title = $('<h1>'+ base.options.ContentTitle +'</h1>');
 
              var tempTitle = divTitle.append( title );
              base.$el.append( tempTitle );

          }

          
       
          var divClass = $('<div class="'+ base.options.classVideoAds +'" style="display:none"></div>');
          var videoConfig = { "preload": "auto" };
          var video = $( '<video id="'+ base.options.idVideoAds+'" class="popup-video video-js vjs-default-skin" ></video>' );
              
          if( base.options.link === null ) {

            videoConfig.sources = [{ "type": "video/mp4", "src": "video/nameVideoAds.mp4" }];

          }else if ( base.options.link.indexOf( "youtu.be" ) >= 0 || base.options.link.indexOf( "youtube" ) >= 0 ) {

              videoConfig.techOrder = [ "youtube" ];
              videoConfig.sources = [{ "type": "video/youtube", "src": base.options.link }];
              
      
          }else {

              videoConfig.sources = [{ "type": "video/mp4", "src": base.options.link }];
          }

          var tempClass = divClass.append(video);
          base.$el.append( tempClass );
          
          var player = videojs( "#"+ base.options.idVideoAds, videoConfig );
          $( this ).attr( 'player', player );
        
          base.run( base.options.timeShow, base.options.timeHide );
            
        };
           
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
        base.cssContent = function() {

          $( '#' + base.options.idVideoContent ).css({ "position": "absolute", "z-index": "4", "width": "100%", "height": "100%", "overflow": "hidden"  });
          $( '#' + base.options.idVideoContent + ' ' + 'video').css({ "width": "100%", "height": "auto", "overflow": "hidden" });
          $( 'body' ).css({ "max-width": "81%", "height": "auto", "margin": "25px auto", "background-color": "black", "overflow": "hidden"});
          $( '#' + base.options.idWrapp ).css({ "position": "relative", "width": "100%", "height": "100%", "padding-bottom": "56.25%" });

        }

        base.show = function() {
            
          /*video content*/

          $( '#' + base.options.idVideoContent ).css({ "width":"29%", "height":"29%", "top":"9.05%", "left":"auto", "right":"0.5%" });

          if( base.options.mutedContent === null || base.options.mutedContent === "false"){
            $( '#'+ base.options.idVideoContent +' '+ 'video' ).prop( { "muted" : false } );
            videojs( base.options.idVideoAds ).muted(true);
          } else if( base.options.mutedContent === "true" ){
            $( '#'+ base.options.idVideoContent +' '+ 'video' ).prop( { "muted" : true } );
            $( '#' + base.options.idVideoContent ).css({ "pointer-events": "none" });
            videojs( base.options.idVideoAds ).muted(false);
          }
          
          /*video ads*/
          $( '.' + base.options.classVideoAds ).show();
          $( '.' + base.options.classVideoAds ).css({ "pointer-events": "none" });
          $( '.' + base.options.classVideoAds ).css({ "position":"absolute", "z-index": "1000", "width": "69%", "height": "69%", "overflow": "hidden", "top": "9.05%", "left": "0.5%" });
          $( '.' + base.options.classVideoAds + ' ' + '#' + base.options.idVideoAds ).css({ "width": "100%", "height": "100%" });
          
          videojs( base.options.idVideoAds ).play();

          /*Banner*/
          $( '.' + base.options.classBannerAds ).css({ "position":"absolute", "z-index": "100000", "width": "29%", "height": "40%",  "overflow": "hidden", "bottom": "20%", "right": "0.5%" });
          $( '.' + base.options.classBannerAds + ' ' + 'img' ).css({ "max-width": "100%", "height": "96%"});
          $( '.' + base.options.classBannerAds ).animate({
             width: 'show'
          });
          
          /*Title*/
          $( '.' + base.options.classTitle ).css({ "position":"absolute", "z-index": "1000000", "max-width": "100%", "height": "20%",  "overflow": "hidden", "top": "-2%", "left": "0%", "color":"white", "font-size": "1.2vw" });
          $( '.' + base.options.classTitle ).show();

        }
          
        base.hide = function() {
          
          /*video content*/
          $( '#' + base.options.idVideoContent ).css({ "width": "100%", "height": "100%", "top": "auto", "left": "auto", "bottom": "auto", "right": "auto" });
          $( '#'+ base.options.idVideoContent +' '+ 'video' ).prop( { "muted" : false } );
          $( '#' + base.options.idVideoContent ).css({ "pointer-events": "visible" });
     
          /*video ads*/
          videojs( base.options.idVideoAds ).pause();
          $( '.' + base.options.classVideoAds ).animate({
              width: 'hide'
          });

          /*Banner*/
          $( '.' + base.options.classBannerAds ).css( {"display":"none"});
          $( '.' + base.options.classBannerAds ).animate({
              width: 'hide'
          });

          /*Title*/
          $( '.' + base.options.classTitle ).css({ "display":"none"});
          $( '.' + base.options.classTitle ).animate({
              width: 'hide'
          });

        }
         
        base.init();

    };

    $.fn.pipAds = function( options ) {

        return this.each( function() {
             new $.pipAds( this, options );
        });

    };

})( jQuery );

        

          

        

    



            