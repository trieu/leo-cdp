/*
 * LEO JS code for creating Form with JSON Schema - version 1.0 - built on Sep 8,2020
 * this JS deps on https://github.com/jsonform/jsonform
 */

// ------------ LEO Form ------------------
(function() {
	
	var errorMsg = '<p>  Your name, your email, phone and gender are required information </p>';
	var successInfo = '<div class="alert alert-success"><strong>Success!</strong> Your data is submitted successfully.</div>'
	
    if (typeof window.LeoForm === "undefined") {
    	
    	function render(formId, holderId, contentKeywords){
    		var formSelector = $('#'+formId);
    		formSelector.jsonForm({
    	         schema: {
    	           firstname: {
    	             type: 'string',
    	             title: 'Your Name',
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
    	               "default": 84
    	               required: true
    	           },
    	           genderStr: {
    	               "type": "string",
    	               "title": "Your Gender",
    	               "enum": [ "Unknown", "Male", "Female"],
    	               required: true
    	           },
    	           contentKeywords: {
	        	      "type": "array",
	        	      "title": "Select all topics you like to update information: ",
	        	      "items": {
	        	          "type": "string",
	        	          "title": "Option",
	        	          "enum": Object.keys(contentKeywords)
	        	      }
	        	    }
    	         },
    		     form: [
    		          {"key": "firstname"},
    		          {"key": "email"},
    		          {"key": "phone"},
    		          {"key": "age"},
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
    	         onSubmit: function (errors, profileData) {
    	           if (errors) {
    	             $('#subscription_form_error').html(JSON.stringify(errors)).show().delay(5000).fadeOut('slow');;
    	           }
    	           else {
    	          	 if(profileData.firstname !== '' && profileData.email !== '' && profileData.age >= 0 ){
    	          		 var extData = {};
    	          		 extData.contentKeywords = profileData.contentKeywords.concat([]);
    	          		 delete profileData.contentKeywords;
    	          		 
    	          		 console.log(profileData)
    	          		 console.log(extData)
    	          		 LeoObserverProxy.updateProfileBySession(profileData, extData);
    	          		 $('#'+holderId).empty().html(successInfo).show().delay(5000).fadeOut('slow');
    	          	 } else {
    	          		 $('#subscription_form_error').html(errorMsg).show().delay(5000).fadeOut('slow');
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

})();

