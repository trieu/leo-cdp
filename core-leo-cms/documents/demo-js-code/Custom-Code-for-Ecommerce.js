var isProductView = location.href.indexOf('/product/') > 0;

// Facebook Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2757042544554702');
fbq('track', 'PageView');


// Leo Web Observer for channel: Demo Bookshop
(function() {
  window.leoObserverLogDomain = "demotrack.leocdp.net";
  window.leoObserverCdnDomain = "demostatic.leocdp.net";
  window.leoAdServerDomain = "demo.leocdp.net";
  
  window.leoObserverId = "6QvW6AZViYFWuzMOOkfvSx";
  window.srcTouchpointName = encodeURIComponent(document.title);
  window.srcTouchpointUrl = encodeURIComponent(location.protocol + '//' + location.host + location.pathname);

  var leoproxyJsPath = '/js/leo-observer/leoproxy.js';
  var src = location.protocol + '//' + window.leoObserverCdnDomain + leoproxyJsPath;
  var jsNode = document.createElement('script');
  jsNode.async = true;
  jsNode.src = src;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(jsNode, s);
})();

function leoObserverProxyReady() {
  //Leo is ready, record event data
  if( isProductView ) {
    var sku = jQuery('span.sku').text();
    LeoObserverProxy.recordViewEvent("product-view", {'product-sku': sku });
  } else {
    LeoObserverProxy.recordViewEvent("content-view");
  }
  
  setTimeout(function(){
  	// update OneSignal Data user ID to Leo CDP
    var isSynchData = typeof localStorage.getItem("synch-onesignal-to-leocdp") === 'string';
    if(window.OneSignal && ! isSynchData ){
      OneSignal.isPushNotificationsEnabled(function(isEnabled) {
        if (isEnabled) {
            // user has subscribed
            OneSignal.getUserId( function(userId) {
                console.log('player_id of the subscribed user is : ' + userId);
                // Make a POST call to your server with the user ID   
              	var onesignalData = {notificationProvider: 'onesignal', notificationUserId : userId };
                LeoObserverProxy.updateProfileBySession(onesignalData);
                localStorage.setItem("synch-onesignal-to-leocdp","true")
            });
        }
      });
    }
  },1500)
}


// Lava
if( isProductView ) {
  var jsNode = document.createElement('script');
  jsNode.async = true;
  jsNode.src = "https://vnexpress.lavamedia.vn/pixel.js";
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(jsNode, s);
  setTimeout(function(){jQuery('#ifrm').hide()},1000)
}


// ------------ LEO Form ------------------
(function() {
  
	var errorMsg = '<p> Your name, your email, phone are required information </p>';
	var successInfo = '<div class="alert alert-success"><strong>Success!</strong> Your data is submitted successfully.</div>';
	
    if (typeof window.LeoForm === "undefined") {
    	var extractRootDomain = function(url){
         	try {
         	    return new URL(url).hostname.split('.').slice(-2).join('.');
         	} catch(e) {} return "";
    	}
    	
    	function render(formId, holderId, contentKeywords){
    		var formSelector = jQuery('#'+formId);
    		formSelector.jsonForm({
    	         schema: {
    	           firstname: {
    	             type: 'string',
    	             title: 'Your First Name',
    	             required: true
    	           },
    	           lastname: {
      	             type: 'string',
      	             title: 'Your Last Name',
      	             required: true
      	           },
    	           email: {
    	               type: 'email',
    	               title: 'Your Email',
    	               required: true
    	           },
    	           phone: {
    	               "type": "number",
    	               "title": "Your Phone",
    	               "default": 84,
    	               required: true
    	           },
    	           genderStr: {
    	               "type": "string",
    	               "title": "Your Gender",
    	               "enum": [ "Unknown", "Male", "Female"]
    	           },
    	           contentKeywords: {
	        	      "type": "array",
	        	      "title": "Select all categories you want to update information: ",
	        	      "items": {
	        	          "type": "string",
	        	          "title": "Option",
	        	          "enum": Object.keys(contentKeywords)
	        	      }
	        	    }
    	         },
    		     form: [
    		          {"key": "firstname"},
    		          {"key": "lastname"},
    		          {"key": "email"},
    		          {"key": "phone"},
    		          {
    		            "key": "genderStr",
    		            "type": "radios"
    		          },
    		          { "key": "contentKeywords" , "type": "checkboxes", "titleMap": contentKeywords },
    		          {
			              "type": "actions",
			              "items": [
			                {
			                  "type": "submit",
			                  "title": "Submit"
			                }
			              ]
		               }
    		       ]
    	         ,
    	         onSubmit: function (errors, formData) {
    	           if (errors) {
                     console.log(errors)
    	             jQuery('#leo_form_error').html(JSON.stringify(errors)).show().delay(5000).fadeOut('slow');;
    	           }
    	           else {
    	          	 if(formData.firstname !== '' && formData.email !== '' && formData.phone !== ''){
    	          		 var extData = {};
    	          		 extData.contentKeywords = formData.contentKeywords.concat([]);
    	          		 delete formData.contentKeywords;
    	          		 
    	          		 // metadata
    	          		 formData.webformProvider = "LeoForm";
    	          		 formData.obsid = window.leoObserverId;
    	          		 formData.tpname = window.srcTouchpointName;
    	          		 formData.tpurl = window.srcTouchpointUrl;
    	          		 formData.tprefurl = document.referrer;
    	          		 formData.tprefdomain = extractRootDomain(document.referrer);
    	          		 
    	          		 LeoObserverProxy.updateProfileBySession(formData, extData);
    	          		 jQuery('#'+holderId).empty().html(successInfo).show().delay(5000).fadeOut('slow');
    	          	 } else {
    	          		 jQuery('#leo_form_error').html(errorMsg).show().delay(5000).fadeOut('slow');
    	          	 }
    	           }
    	         }
    	       });
    	      jQuery('#'+holderId).show();
    	}

    	var LeoForm = {};
    	LeoForm.render = render;
        window.LeoForm = LeoForm;
    }
  
    setTimeout(function(){
        var contentKeywords = {
        		"bigdata-ai" :"Big Data & A.I", 
        		"business" : "Business", 
        		"industry-4.0" : "Industry 4.0", 
        		"marketing" :  "MARKETING"
        };
        LeoForm.render('leo_registration_form','subscription_placeholder', contentKeywords);
    },900)
})();