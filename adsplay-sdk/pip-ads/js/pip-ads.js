(function($){
    "use strict";

   
    $.pipAds = function(el, options){
     
     	var base = this;
		base.$el = $(el);
        base.el = el;
		base.$el.data("pipAds", base);

        $.pipAds.defaultOptions = {
      
	        classVideoAds: 'video-ads',
	        idVideoAds: 'my-video-ads',
	        link: null,
	        type: null,
	        timeShow: 3000,
	        timeHide: 10
	        // config : "{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "https://www.youtube.com/watch?v=xjS6SftYQaQ"}] }"
	        


	    };
	    

        base.init = function(){

            base.options = $.extend({},$.pipAds.defaultOptions, options);

            var videoConfig = {"controls": false, "preload": "auto" };
                var video = $('<video id="'+base.options.idVideoAds+'" class="popup-video video-js vjs-default-skin"></video>');
                
            if(base.options.link === null){

            	videoConfig.sources = [{ "type": "video/mp4", "src": "video/nameVideoAds.mp4"}];

            }else if (base.options.link.indexOf("youtu.be") >= 0 || base.options.link.indexOf('youtube') >= 0){

                videoConfig.techOrder = ["youtube"];
                videoConfig.sources = [{ "type": "video/youtube", "src": base.options.link}];
                
				
			}else{

                videoConfig.sources = [{ "type": "video/mp4", "src": base.options.link}];
			}
                
            base.$el.append(video);
          
            var player = videojs("#"+ base.options.idVideoAds, videoConfig);
            $(this).attr('player', player);
          
           
            base.run(base.options.timeShow, base.options.timeHide);
            
        };
           
        base.run = function(timeShow, timeHide) {
            
            setTimeout(function(){
	        base.show();
	        var countDown = setInterval(function(){
	            	timeHide -= 1;
		            if (timeHide <= 0){
		              base.hide();
		              return clearInterval(countDown);
		            }
	        	}, 1000);

	     	 }, timeShow);
            
        }

        base.show = function() {
            
             /*video content*/

           $(" .video-content ").css({"width":"29%","height":"40%","top":"7.5%","left":"auto","right":"0.5%"});
           // $(" .video-content ").css({"width":"20%","height":"20%","top":"auto","left":"auto","bottom":"37%","right":"23%"});
           $(" video#my-video-content " ).prop( {"muted" : true } );
           $(" video#my-video-content " ).prop( {"controls" : false } );

           /*video ads*/
           $('.' + base.options.classVideoAds ).animate({
              width:'show'
           });
           // $(" .video-ads ").css({"width":"5%","height":"57%"});
           $(" .video-ads ").css({"top":"9.5%","left":"0.5%"});
           videojs(base.options.idVideoAds).play();
            
        }

        base.hide = function() {
            
            /*video content*/
	        $(" .video-content ").css({"width":"100%","height":"100%","top":"auto","left":"auto","bottom":"auto","right":"auto"});
			$(" video#my-video-content " ).prop( {"muted" : false } );
	        $(" video#my-video-content " ).prop( {"controls" : true } );

	        /*video ads*/
	        $('.' + base.options.classVideoAds ).animate({
	            width:'hide'
	        });
	        videojs(base.options.idVideoAds).pause();
	       
        }

        base.init();

       
    };

    $.fn.pipAds = function(options){
        return this.each(function(){
             new $.pipAds(this, options);
        });
    };

})(jQuery);

        

          

        

    



            