var isNull = function(val){
	if(typeof val === "undefined" || val === null || val === ""){
		return true;
	}
	return false;
};

(function($){
	$.popup = function (el, options) {
		this.options = options;
		this.$el = $(el);

		this.link = isNull(this.$el.attr('href')) ? "#" : this.$el.attr('href');
		this.$el.data("popup", this);
		this.init();
	};

	$.popup.prototype = {
		defaults: {
			link: "#",
			action: "both",
			timeout: 3000,
			open: null,
			close: null
		},
		init: function () {
			var base = this,
				$el = base.$el,
				el = $el[0];

			base.settings = $.extend({}, base.defaults, base.options);

			if (this.$el.parent().next('.popup-output').length == 0) {
				base.build(); 
			}

			var link = ( this.link != "#" ) ? base.link : base.settings.link;	
			base.event(link);
		},

		build: function () {
			this.$el.parent().append('<div class="popup-output"><div class="popup-result"><span class="popup-close">×</span></div></div>');
		},

		event: function (link) {
			var base = this;
			var	popupClick = this.$el;
			var popupOutput = this.$el.next('.popup-output'),
				popupResult = popupOutput.find('.popup-result'),
				popupClose = popupOutput.find('.popup-close');

			var	isShow = false;
			
			var effect_zoom = function(){
				if (isShow) {
					$('html').css({"overflow": "auto"});
					popupResult.animate({ value: -1 }, {
						step: function(now,fx) {
							$(this).css({"transform": "scale("+ now +")", "opacity": now})
						},
						duration: 300,
					});
				}
				else{
					$('html').css({"overflow": "hidden"});
					popupResult.animate({ value: 1 }, {
						step: function(now,fx) {
							$(this).css({"transform": "scale("+ now +")", "opacity": now})
						},
						duration: 200,
					});
				}
			};

			var open_popup = function(){
				if (!isShow) {
					popupClick.fadeOut(100);
					popupOutput.fadeIn(100);
					effect_zoom();

					base.settings.open.call(base, link, popupResult);
					isShow = true;
				}
			};

			if (base.settings.action == "both" || base.settings.action == "click") {
				popupClick.click(function(e){
					e.preventDefault();
					open_popup();
				});
			}
			if (base.settings.action == "both" || base.settings.action == "hover") {
				var timeout = isNull(base.settings.timeout) ? 3000 : base.settings.timeout;
				var timer,countDown;
				popupClick.mouseenter(function() {
					popupClick.append('<div class="loading"><span class="count-down"></span></div>');
					var second = parseInt(timeout)/1000;
					$count = popupClick.find('.count-down');
					$count.text(second);

					countDown = setInterval(function(){
						second -= 1;
						$count.text(second);
						if (second <= 0){
							open_popup();
							return clearInterval(countDown);
						}
						
					}, 1000);
				})
				.mouseleave(function(){
					popupClick.find('.loading').remove();
					clearInterval(countDown);
				});
			}

			popupClose.click(function(e){
				base.settings.close.call(base);
				effect_zoom();
				popupOutput.fadeOut(100);
				isShow = false;
			});

			popupOutput.click(function(e) {
				if (isShow && $(e.target).is(popupOutput)) {
					popupClose.trigger('click');
				}
			});
			
		},

		destroy: function () {
			this.$el.removeData('popup');
			$(this.$el).unbind();
		}
	};

	$.fn.popup = function(options) {
		return this.each(function() {
			new $.popup(this, options);
		});
	};

})(jQuery);

function popupAds(id,placementId,options){
	var tagA = $('<a class="popup-point" target="_blank"></a>');
	var placement = $("#"+placementId);
	placement.html(tagA);

	var	action,innerA;

	if (!isNull(options)) {
		action = isNull(options.action) ? "both" : options.action;
		innerA = isNull(options.text) ? "Ads" : options.text;
		innerA = isNull(options.thumbnail) ? innerA : '<img src="'+options.thumbnail+'">';
	}
	
	tagA.html(innerA);
	tagA.popup({
		link: id,
		action: action,
		open: function(link, popupResult){
			if (!isNull(options)) {
				if (!isNull(options.pausevideo)) {
					document.getElementById(options.pausevideo).pause();
				}
			}
			if (isNull($(this).attr('player'))) {
				var loading = $('<div class="loading"></div>');
				popupResult.append(loading);
				var videoId = new Date().getTime();
				var	videoConfig = { "width": "100%", "height": "100%", "controls": true, "autoplay": true, "preload": "auto" };
				var video = $('<video id="video-'+videoId+'" class="popup-video video-js vjs-default-skin"></video>');

				if (link.indexOf("youtu.be") >= 0 || link.indexOf('youtube') >= 0) {
					videoConfig.techOrder = ["youtube"];
					videoConfig.sources = [{ "type": "video/youtube", "src": link}];
				}
				else{
					videoConfig.sources = [{ "type": "video/mp4", "src": link}];
				}
				loading.remove();
				popupResult.append(video);
				var player = videojs("video-"+videoId, videoConfig);
				$(this).attr('player', player);
			}
		},
		close: function(){
			var player = $(this).attr('player');
			if (!isNull(player)) {
				player.pause();
			}
			if (!isNull(options)) {
				if (!isNull(options.pausevideo)) {
					document.getElementById(options.pausevideo).play();
				}
			}
		}
	});
}
