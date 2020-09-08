/*
 * LEO JS code for creating Form with JSON Schema - version 1.0 - built on Sep 8,2020
 * this JS deps on https://github.com/jsonform/jsonform
 */

// ------------ LEO Form ------------------
(function() {
    if (typeof window.LeoForm === "undefined") {
    	
    	function render(formId, holderId){
    		 $('#'+formId).jsonForm({
    	         schema: {
    	           firstname: {
    	             type: 'string',
    	             title: 'First Name',
    	             required: true
    	           },
    	           lastname: {
    	               type: 'string',
    	               title: 'Last Name',
    	               required: true
    	           },
    	           email: {
    	               type: 'email',
    	               title: 'Contact Email',
    	               required: true
    	           },
    	           genderStr: {
    	               "type": "string",
    	               "title": "Gender",
    	               "enum": [ "Unknown", "Male", "Female", "LGBT"],
    	               required: true
    	           },
    	           age: {
    	             type: 'integer',
    	             title: 'Age',
    	             minimum: 16,
    	             maximum: 150
    	           }
    	         },
    		     form: [
    		          {"key": "firstname"},
    		          {"key": "lastname"},
    		          {"key": "email"},
    		          {"key": "age"},
    		          {
    		            "key": "genderStr",
    		            "type": "radios"
    		          },
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
    	         onSubmit: function (errors, values) {
    	           if (errors) {
    	             $('#subscription_form_error').html('<p> Missing info </p>');
    	           }
    	           else {
    	          	 console.log(values)
    	          	 if(values.firstname !== '' && values.email !== '' && values.age > 16){
    	          		 LeoObserverProxy.updateProfileBySession(values)
    	          	 } else {
    	          		 $('#subscription_form_error').html('<p> Missing info </p>');
    	          	 }
    	           }
    	         }
    	       });
    	      $('#'+holderId).show();
    	}

    	var LeoForm = {};
    	LeoForm.render = render;
        window.LeoForm = LeoForm;
    }

})();

