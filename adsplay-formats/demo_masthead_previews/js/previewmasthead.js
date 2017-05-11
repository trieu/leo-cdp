 /*Init program*/
        init();
        

        function init() {   

            $('#change').collapse()
            /*user config defaults here */
            var link = "https://www.youtube.com/watch?v=Uwvvc51JLrk";
            var id_youtube = "Uwvvc51JLrk";
           
            $( "#id_TimeAd" ).val("15000");
            $( "#id_Adtitle" ).val("Demo Masthead Ads");
            $( "#id_Addescription" ).val("TExperience the Video Masthead with your own content and customizations");
            $( "#id_AdText" ).val("Click");
            $( "#id_AdDestinationURL" ).val(link);

            
            /*get value*/
            var value_Title = $( "#id_Adtitle" ).val();
            var value_Description = $( "#id_Addescription" ).val();
            var value_Text = $( "#id_AdText" ).val();
            var value_Destination = $( "#id_AdDestinationURL" ).val();

            //video
            $("#id_Link").attr('data-id', 'youtube');
            $( "#video-desktop" ).html('<div id="id_video"><iframe id="id_youtube" src="https://www.youtube.com/embed/' + id_youtube + '?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer" ></iframe></div>' );

            /*img thumbnail*/
            $('#img-mobile').html('<div id="id_thumb"><img  src="http://img.youtube.com/vi/'+ id_youtube +'/0.jpg"></div>');

            /*change content*/
            $( "#title_d" ).html("<h3><strong>" + value_Title + "</strong></h3>");
            $( "#description_d" ).html(value_Description);
            $( "#button_d" ).val(value_Text);
            $( "#link_d" ).attr('href', value_Destination);

            $( "#title_m" ).html("<h3><strong>" + value_Title + "</strong></h3>");
            $( "#description_m" ).html(value_Description);
            $( "#button_m" ).val(value_Text);
            $( "#link_m" ).attr('href', value_Destination);

            /*Time show*/
            setTimeout(show, 15000);

        }

        /* submit preview */
        $( "#submit_preview" ).click(function() {
            event.preventDefault();
            
            var value = $('#id_Link').val();
            
           
            if(typeof(value) !== 'undefined' && value.indexOf("youtu") != -1){
               
                $("#id_Link").attr('data-id', 'youtube');
                var code = youtube(value);
             
                if( code !== 'error' ) {

                    //video
                    $( "#video-desktop" ).html('<div id="id_video"><iframe id="id_youtube" src="https://www.youtube.com/embed/'+
                        code+'?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer" ></iframe></div>' );

                    /*img thumbnail*/
                    $('#img-mobile').html('<div id="id_thumb"><img  src="http://img.youtube.com/vi/'+ code +'/0.jpg"></div>');



                    /*Time show*/
                    setTimeout(show, 10000);

                } 
                
            }
        });

        /* submit full content */
        $( "#submit" ).click(function() {
            event.preventDefault();
            
            var value = $('#id_Link').val();
            var value_Title = $( "#id_Adtitle" ).val();
            var value_Description = $( "#id_Addescription" ).val();
            var value_Text = $( "#id_AdText" ).val();
            var value_Destination = $( "#id_AdDestinationURL" ).val();
           
            if(typeof(value) !== 'undefined' && 
                value_Title !== "" && 
                value_Description !== "" &&
                value_Text !== "" &&
                value_Destination !== "" &&
                 value.indexOf("youtu") != -1){
               
                $("#id_Link").attr('data-id', 'youtube');
                var code = youtube(value);
             
                if( code !== 'error' ) {

                    //video
                    $( "#video-desktop" ).html('<div id="id_video"><iframe id="id_youtube" src="https://www.youtube.com/embed/'+
                        code+'?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer" ></iframe></div>' );

                    /*img thumbnail*/
                    $('#img-mobile').html('<div id="id_thumb"><img  src="http://img.youtube.com/vi/'+ code +'/0.jpg"></div>');

                    /*change content*/
                 
                    $( "#title_d" ).html("<h3><strong>" + value_Title + "</strong></h3>");
                    $( "#description_d" ).html(value_Description);
                    $( "#button_d" ).val(value_Text);
                    $( "#link_d" ).attr('href', value_Destination);

                    $( "#title_m" ).html("<h3><strong>" + value_Title + "</strong></h3>");
                    $( "#description_m" ).html(value_Description);
                    $( "#button_m" ).val(value_Text);
                    $( "#link_m" ).attr('href', value_Destination);

                    var setTime = $( "#id_TimeAd" ).val();
                    setTimeout(show, setTime);

                } 
                
            }
        });

        /* change content */
        function show() {

           $("#id_video").css({'width':'57%', 'height': '92%', 'margin': '10px'});
           toggleVideo();

        }

        /* pauseVideo */
        function toggleVideo() {
            var div = document.getElementById("id_video");
            var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
            div.style.display =  'inline';
            func =  'pauseVideo';
            // func = state == 'hide' ? 'pauseVideo' : 'playVideo';
            iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
        }

        var youtube = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return 'error';
            }
        };