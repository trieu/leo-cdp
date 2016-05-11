/*
	SuperBox v1.0.0
	by Todd Motto: http://www.toddmotto.com
	Latest version: https://github.com/toddmotto/superbox
	
	Copyright 2013 Todd Motto
	Licensed under the MIT license
	http://www.opensource.org/licenses/mit-license.php

	SuperBox, the lightbox reimagined. Fully responsive HTML5 image galleries.
*/
;(function($) {
		
	$.fn.SuperBox = function(options) {
		
		var superbox      = $('<div class="superbox-show animated media"></div>');
		var superboximg   = $('<img src="" class="superbox-current-img col-md-6 p-0 m-r-15 pull-left">');
		var superboxclose = $('<div class="superbox-close">&times;</div>');
		
		superbox.append(superboximg).append(superboxclose);
		
		return this.each(function() {
			
			$('.superbox-list').click(function() {
                
				var currentimg = $(this).find('.superbox-img');
                                var imgHeight = $('.superbox-current-img').height();
				var imgData = currentimg.data('img');
                                var imgInfo = '';
                                
                                if($(this).find('.superbox-info')[0]) {
                                    imgInfo = $(this).find('.superbox-info').html();
                                }
                                else {
                                    imgInfo = '';
                                }
                                
                                
				superboximg.attr('src', imgData);
				
                                $('.img-info').remove();
				if($('.superbox-current-img').css('opacity') == 0) {
					$('.superbox-current-img').animate({opacity: 1});
				}
				
				if ($(this).next().hasClass('superbox-show')) {
					superbox.toggleClass('toggled');
				} else {
					superbox.insertAfter(this).addClass('toggled').css('minHeight', imgHeight);
				}
				
				$('html, body').animate({
					scrollTop:superbox.position().top - currentimg.width()
				}, 'medium');
                                
                                $('.superbox-show').append('<div class="img-info media-body">'+ imgInfo +'</div>');
			
			});
                        

                        $(window).resize(function(){
                            if($('.superbox-show')[0]) {
                                $('.superbox-show').each(function(){
                                    var thisHeight = $(this).find('.superbox-current-img').height();
                                    
                                    $(this).css('minHeight', thisHeight);
                                });
                            }   

                        })
                        .resize();

						
			$('body').on('click', '.superbox-close', function() {
				$('.superbox-current-img').animate({opacity: 0}, 200, function() {
					$('.superbox-show').removeClass('toggled');
				});
			});
			
		});
	};
})(jQuery);