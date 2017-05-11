;(function () { 


	// Helpers
	function extend(obj1, obj2) {

		var obj = {};
		for (var key in obj1) {
			obj[key] = obj2[key] === undefined ? obj1[key] : obj2[key];
		}
		return obj;

	}

	var defaults = {

		link: "https://ads-cdn.fptplay.net/static/ads/instream/ba72341a558b1246c65bbdcd15837c1d.mp4",
		title: "Demo Masthead Ads",
		description: "TExperience the Video Masthead with your own content and customizations",
		btntext: "Clicks",
		destination: "https://www.youtube.com/watch?v=_eEv6Yww5EU",
		positionWrapper: "absolute",
		marginleftWrapper: "440px",
		widthWrapper: "35%",
		heightWrapper: "550px"

	};

	// Constructor: PlaceMastHead
	function PlaceMastHead(el, options) {

		this.el = el;
		options = options || {};
		this.options = extend(defaults, options);
		this.begin();

	}

	PlaceMastHead.prototype.begin = function() {

		var self = this;
		self.mobile();
		
	};

	PlaceMastHead.prototype.mobile = function() {
		
		var self = this;
		
        

		var wrapper_mobile = document.createElement( "div" );
			wrapper_mobile.setAttribute( "id", "id_web" );
			
			wrapper_mobile.setAttribute( "style", 
				" position:"+ self.options.positionWrapper +
				";margin-left:"+self.options.marginleftWrapper+
				";width:"+ self.options.widthWrapper +
				";height:"+ self.options.heightWrapper );
			
		if( self.options.link.indexOf( "youtu.be" ) >= 0 || self.options.link.indexOf( "youtube" ) >= 0 ) {
			var code = self.youtube(self.options.link);
			var div_video = document.createElement( "div" );
			div_video.setAttribute( "id", "id_video" );
			var frame = document.createElement( "iframe" );
				frame.setAttribute( "id", "id_frame" );
				frame.setAttribute( "data-id", "youtube" );
				frame.setAttribute( "style", "width: 100%; height: 100%; border: none" );
				frame.setAttribute( "src", "https://www.youtube.com/embed/" + code + "?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer" );
			div_video.appendChild(frame);
		} else {

			var div_video = document.createElement( "div" );
			div_video.setAttribute( "id", "id_video" );
			var video = document.createElement( "video" );
				video.setAttribute( "id", "id_mp4" );
				video.setAttribute( "style", "width: 100%; height: 100%; border: none" );
				video.setAttribute( "autoplay", true );
				video.setAttribute( "controls", true );
			var source = document.createElement( "source" );
				source.setAttribute( "src", self.options.link );
				source.setAttribute( "type", 'video/mp4' );

			video.appendChild( source );
			div_video.appendChild( video );

			console.log(div_video)

		}
		
		
		

		var div_content = document.createElement( "div" );
			div_content.setAttribute( "id", "id_content" );

		var div_title = document.createElement( "div" );
			div_title.setAttribute( "id", "id_title" );
			
			
		var div_description = document.createElement( "div" );
			div_description.setAttribute( "id", "id_description" );
			// div_description.setAttribute( "value", "id_description" );
			

		var div_button = document.createElement( "div" );
			div_button.setAttribute( "id", "id_button" );
		var a = document.createElement( "a" );
			a.setAttribute( "id", "id_a" );
			a.setAttribute( "href", self.options.destination );
			a.setAttribute( "target", "_blank" );

		var input = document.createElement( "input" );
			input.setAttribute( "type", "submit" );
			input.setAttribute( "id", "button" );
			input.setAttribute( "value", self.options.btntext );
			// console.log(a)
			a.appendChild( input );

		div_button.appendChild( a );

		div_content.appendChild( div_title );
		div_content.appendChild( div_description );
		div_content.appendChild( div_button );
		
		wrapper_mobile.appendChild( div_video );
		wrapper_mobile.appendChild( div_content );
		self.el.appendChild( wrapper_mobile );

		self.addContent();
	
		console.log(self.el)
	
	}

	

	PlaceMastHead.prototype.addContent = function () {

		var self = this;

		document.getElementById( "id_title" ).innerHTML = self.options.title;
		document.getElementById( "id_description" ).innerHTML = self.options.description;
		
	};

	PlaceMastHead.prototype.youtube = function(url) {

		var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }

	}
	
	

	var masthead = function (params) {
		
		new PlaceMastHead(params.el, params.options);
	};

	// open to the world.
	// commonjs
	if( typeof exports === 'object' )  {

		module.exports = masthead;

	}
	// AMD module
	else if( typeof define === 'function' && define.amd ) {

		define(function () {
			return masthead;
		});

	}
	// Browser global
	else {
		window.masthead = masthead;
	}

})();
