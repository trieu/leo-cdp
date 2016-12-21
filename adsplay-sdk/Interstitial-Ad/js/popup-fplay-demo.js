
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

          classVideoAds: 'classVideoAds',
          classYoutubeAds: 'classYoutubeAds',
          idVideoAds: 'idVideoAds',

        };
        /*======================Init====================================*/
        /*init main*/
        base.init = function() {

          base.options = $.extend( {},$.LightBoxAds.defaultOptions, options );
          // base.run( base.options.timeShow, base.options.timeHide );
          base.show();

        };

        base.ImagePopup = function() {
          var WrappImagePopup = $('<div class="wrappImagePopup"></div>');
          var TitleImagePopup = $('<div class="TitleImagePopup">Interstitial Ad Demo</div>');
          var ContentPopup = $('<div class="ContentPopup"></div>');
          var image = $('<img src="images/banner.png" />');
              ContentPopup.append(image);
          var ClickPopup = $('<div class="ClickPopup"></div>');
          var ButtonPopup = $('<button><a target="_blank" href="https://www.toshiba.com.vn/">Call to Action</a></button>');
              ClickPopup.append(ButtonPopup);

          var divClose = $('<div class="DivCloseImagePopup"></div>');
          var CloseImagePopup = $('<span class="CloseImagePopup">×</span>');
              divClose.append(CloseImagePopup);

          var tempClass = WrappImagePopup.append(TitleImagePopup)
                                         .append(ContentPopup)
                                         .append(ClickPopup)
                                         .append(divClose);
          console.log(tempClass)
          base.$el.parent().append(tempClass);

        }

        /*event of video after click thumbnail*/
        base.videoAfterClickThumbnail = function() {

          $( '.'+ base.options.classWrapp +' '+ 'video' ).prop( { "muted" : true } );
          videojs( base.options.idVideo ).pause();
        }

        /*event button close popup*/
        base.clickClosePopup = function() {
          $(" .DivCloseImagePopup ").bind('click', function() {
            $(' .wrappImagePopup ').detach();
            $('.'+ base.options.classVideoAds ).detach();
            $( '.'+ base.options.classWrapp +' '+ 'video' ).prop( { "muted" : false } );
            videojs( base.options.idVideo ).play();

          });
        }

        base.show = function() {
          //muted and pause video
          base.videoAfterClickThumbnail();

          //create Image
          base.ImagePopup();

          //event when click button ClosePopup
          base.clickClosePopup();

        }

        base.init();

    };

    $.fn.LightBoxAds = function( options ) {

        return this.each( function() {
             new $.LightBoxAds( this, options );
        });

    };

})( jQuery );

/*init plugin*/
$(".example-video-container").LightBoxAds({

    idVideo: "my-video",//id video

});
