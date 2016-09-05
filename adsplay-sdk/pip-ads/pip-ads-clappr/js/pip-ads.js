(function( $ ) {

    "use strict";

    $.pipAds = function( el, options ) {
     
     	  var base = this;
    		base.$el = $(el);
        base.el = el;
    		base.$el.data( "pipAds", base );

        $.pipAds.defaultOptions = {
      
          classVideoAds: 'video-ads',
          classBannerAds: 'banner-ads',
          classTitleAds: 'title-ads',
	        ContentTitle: null,
	        idVideoAds: 'my-video-ads',
          linkBanner: null,
	        link: null,
	        type: null,
	        timeShow: 3000,
	        timeHide: 10
	        
	      };
	    

        base.init = function() {

            base.options = $.extend( {},$.pipAds.defaultOptions, options );

            

            var divTitle = $('<div class="'+ base.options.classTitleAds +'" style="display:none"></div>');
            var title = $('<h1>'+ base.options.ContentTitle +'</h1>');

            var divBanner = $('<div class="'+ base.options.classBannerAds +'" style="display:none"></div>');
            var banner = $('<img src="'+ base.options.linkBanner +'"/>');

         
            var divClass = $('<div class="'+ base.options.classVideoAds +'" ></div>');
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
            var tempBanner = divBanner.append( banner );

            var tempTitle = divTitle.append( title );

            var tempClass = divClass.append(video);
            // console.log(temp)
            base.$el.append( tempClass );
            base.$el.append( tempBanner );
            base.$el.append( tempTitle );
       
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

        base.show = function() {
            
          /*video content*/

          $( "#video-content" ).css({ "width":"29%", "height":"29%", "top":"9.05%", "left":"auto", "right":"0.5%" });
          $( "#video-content video" ).prop( { "muted" : true } );
           $( "#video-content" ).css({ "pointer-events": "none" });
          // $( "#video-content video" ).prop( { "chromeless" : true } );
          // $( "#video-content video" ).prop( { "controls" : false } );

          /*video ads*/
          $( '.' + base.options.classVideoAds ).animate({
             width: 'show'
          });

          
          $( '.' + base.options.classVideoAds ).css({ "pointer-events": "none" });
          $( '.' + base.options.classVideoAds ).css({ "position":"absolute", "z-index": "1000", "width": "69%", "height": "69%", "overflow": "hidden", "top": "9.05%", "left": "0.5%" });
          $( '.' + base.options.classVideoAds + ' ' + '#' + base.options.idVideoAds ).css({ "width": "100%", "height": "100%" });
          
         
          // $( '.' + base.options.classVideoAds + ' ' + 'video' ).css({ "width": "100%", "height": "100%" });
          // $( ".banner-ads" ).css({ "top": "9.05%", "left": "0.5%", "border": " solid 3px white " });
          videojs( base.options.idVideoAds ).play();

          /*Banner*/
          $( '.' + base.options.classBannerAds ).css({ "position":"absolute", "z-index": "100000", "width": "29%", "height": "40%",  "overflow": "hidden", "bottom": "14%", "right": "0.5%" });
          $( '.' + base.options.classBannerAds + 'img' ).css({ "width": "100%", "height": "auto",  "overflow": "hidden" });
          $( '.' + base.options.classBannerAds ).animate({
             width: 'show'
          });

          /*Title*/
          $( '.' + base.options.classTitleAds ).css({ "position":"absolute", "z-index": "10", "width": "100%", "height": "20%",  "overflow": "hidden", "top": "-2%", "left": "0%", "color":"white", "display": "inline" });
          $( '.' + base.options.classTitleAds ).animate({
             width: 'show'
          });

        }
          
        base.hide = function() {
          
          /*video content*/
	        $( "#video-content" ).css({ "width": "100%", "height": "100%", "top": "auto", "left": "auto", "bottom": "auto", "right": "auto" });
			    $( "#video-content video" ).prop( { "muted" : false } );
          // $( "#video-content video" ).prop( { "controls" : true } );
	        
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
          $( '.' + base.options.classTitleAds ).css({ "display":"none"});
          $( '.' + base.options.classTitleAds ).animate({
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

        

          

        

    



            