var loadSegmentStatistics = window.loadSegmentStatistics || function(segmentStats) {
	var domSelector = '#donut_chart';
	var width = $(domSelector).empty().width(), height = width, radius = width - 140;
	
	if(segmentStats === false){
		var data = [ {
			count : 0,
			color : '#000000'
		}, {
			count : 100,
			color : '#f8b70a'
		}, ];
		var totalCount = 0; // total manually
		var percentNum = 0;
		renderDonutChart(domSelector, data, totalCount, width, height, radius, percentNum)
	} else {
		var remain = segmentStats.totalProfilesInCdp - segmentStats.totalProfilesInSegment;
		var data = [ {
			count : segmentStats.totalProfilesInSegment,
			color : '#000000'
		}, {
			count : remain ,
			color : '#f8b70a'
		}, ];
		
		var totalCount = segmentStats.totalProfilesInSegment; // total manually
		
		var ratio =  (segmentStats.totalProfilesInSegment / segmentStats.totalProfilesInCdp).toFixed(2);
		var percentNum = Math.floor(ratio * 100);
		renderDonutChart(domSelector, data, totalCount, width, height, radius, percentNum)
	}
}

var deleteSegment = deleteSegment || function() {
	if(typeof segmentDataModel === "object" && segmentDataModel.id != '' ){
		$('#delete_callback').val('');
		$('#confirmDeleteDialog').modal({ focus: true });
        var callback = "deleteSegment" + segmentDataModel.id;
	    window[callback] = function () {
	    	var urlStr = baseAdminApi + '/cdp/segment/delete';
	        LeoAdminApiUtil.callPostAdminApi(urlStr, { 'id' : segmentDataModel.id }, function (json) {
	            if (json.httpCode === 0 ) {
	                if(json.data === true){
	                	iziToast.success({
	                	    title: 'OK',
	                	    message: 'Successfully deleted the segment "'+segmentDataModel.name +'"',
	                	    onClosing: function(instance, toast, closedBy){
	                	    	location.hash = "calljs-leoCdpRouter('Segment_Data_List')";
	                	    }
	                	});
	                } 
	                else {
	                	iziToast.error({
	                	    title: 'Error',
	                	    message: json.data,
	                	    onClosing: function(instance, toast, closedBy){
	                	    	location.reload(true);
	                	    }
	                	});
	                }
	            } else {
	                $('#error-on-save').html(json.errorMessage).show().delay(5000).fadeOut('slow');
	                LeoAdminApiUtil.logErrorPayload(json);
	            }
	        });
	    }
	    $('#delete_callback').val(callback);
	    $('#deletedInfoTitle').html(segmentDataModel.name);
	    $('#deletedInfoMsg').html('Do you want to delete this segment ?');
	}
}

var loadSegmentBuilder = window.loadSegmentBuilder || function(jsonQueryRules, readOnlyMode, callback) {
	
	var dataFilter = [ {
		id : "visitorId",
		label : "Visitor ID",
		type : "string",
		operators : getOperatorsForStringField()
	}, {
		id : "crmRefId",
		label : "CRM ID",
		type : "string",
		operators : getOperatorsForStringField()
	}, {
		id : "firstName",
		label : "First Name",
		type : "string",
		operators : getOperatorsForStringField(),
	}, {
		id : "lastName",
		label : "Last Name",
		type : "string",
		operators : getOperatorsForStringField(),
	}, {
		id : "primaryEmail",
		label : "Email",
		type : "string",
		operators : getOperatorsForStringField(),
	}, {
		id : "primaryPhone",
		label : "Phone",
		type : "string",
		operators : getOperatorsForStringField(),
	}, {
		id : "livingLocation",
		label : "Living Location",
		type : "string",
		operators : getOperatorsForStringField(),
	}, {
		id : "age",
		label : "Age",
		type : "integer",
		validation : {
			min : 16,
			step : 1,
		},
		operators : getOperatorsForNumberField()
	}, {
		id : "gender",
		label : "Gender",
		type : "integer",
		input : "radio",
		values : {
			0 : "Female",
			1 : "Male",
		//	2 : "Lesbian",
		//	3 : "Gay",
		//	4 : "Bisexual",
		//	5 : "Transgender",
			6 : "Unknown",
		},
		operators : [ "equal" ],
	}, {
		id : "totalDataQualityScore",
		label : "Total Data Quality Score",
		type : "integer",
		validation : {
			min : 0,
			step : 1,
		},
		operators : getOperatorsForNumberField()
	}, {
		id : "totalLeadScore",
		label : "Total Lead Score",
		type : "integer",
		validation : {
			min : 0,
			step : 1,
		},
		operators : getOperatorsForNumberField()
	}, {
	    id: 'behavioralEvents',
	    label: 'Behavioral Events',
	    type: 'string',
	    input: 'select',
	    values: {
	      "content-view": 'Content View',
	      "product-view": 'Product View',
	      "social-login": 'Customer Login',
	      "add-to-cart": 'Purchase Intent',
	      "play-prvideo": 'Play PR Video',
	      "submit-contact": 'Submit Contact Form',
	      "buy": 'First Purchase',
	      "feedback-1st": 'First-time Feedback',
	      "social-sharing": 'Social Sharing',
	      "rebuy": 'Repeat Purchase',
	      "feedback-2nd": 'Second-time Feedback',
	    },
	    operators: ['contains_any']
	  }, {
			id : "dataContext",
			label : "Data Context",
			type : "integer",
			input : "radio",
			values : {
				"1" : "Production Data",
				"0" : "Test Data",
				"-1" : "Fake Data"
			},
			operators : [ "equal" ]
	   }, {
			id : "receiveNotification",
			label : "Receive Notification",
			type : "integer",
			input : "radio",
			values : {
				"0" : "No data",
				"1" : "Subscribed",
				"-1" : "Unsubscribed"
			},
			operators : [ "equal" ]
		} , {
			id : "receiveEmail",
			label : "Receive Email",
			type : "integer",
			input : "radio",
			values : {
				"0" : "No data",
				"1" : "Subscribed",
				"-1" : "Unsubscribed"
			},
			operators : [ "equal" ]
		} , {
			id : "receiveMobileSms",
			label : "Receive Mobile SMS",
			type : "integer",
			input : "radio",
			values : {
				"0" : "No data",
				"1" : "Subscribed",
				"-1" : "Unsubscribed"
			},
			operators : [ "equal" ]
		}
	];
	
	var rulesOfQuery = jsonQueryRules || false;

	var ops = _.union(getOperatorsForStringField(),getOperatorsForNumberField()); 
	ops.push({ type: 'contains_any', optgroup: 'custom', nb_inputs: 1, multiple: true, apply_to: ['string'] });
	
	//init UI
	$('#segment-builder-holder').queryBuilder({
		plugins : [ 'bt-tooltip-errors' ],
		operators: ops,
		filters : dataFilter,
		rules : rulesOfQuery
	});
	
	if(readOnlyMode){
		// disable and hide all controllers in segment builder 
		$('#segment-builder-holder').find('input,select').attr('disabled','disabled');
		$('#segment-builder-holder button').hide();
	} else {
		if(typeof callback === 'function'){
			callback();
		}
	}
}

 
var loadProfilesInSegment = window.loadProfilesInSegment || function(segmentId) {
	var holder = $('#profilelist_holder').empty();
	
	var profilelist_tpl = _.template($('#profilelist_tpl').html());
	var htmlTable = profilelist_tpl({tbid : new Date().getTime()});
	holder.html(htmlTable);
	
	var selectorId = holder.find(' > table').attr('id');
	var urlBySegmentId = baseAdminApi + '/cdp/segment/profiles';
	
    loadProfileViewByAjax(selectorId, urlBySegmentId, segmentId)
}

// 
var loadProfileViewByAjax = window.loadProfileViewByAjax || function(selectorId, ajaxUrl, segmentId, jsonQueryRules, beginFilterDate, endFilterDate) {
	console.log(selectorId)
	$('#profile-list-panel').show();
    var usersession = getUserSession();
    if (usersession) {
    	
    	var paramsGetter;
        if(segmentId !== ''){
        	paramsGetter = function (data) {
            	data.segmentId = segmentId;
            	return JSON.stringify(data);
            }
        }
        else {
        	paramsGetter = function (data) {
        		data.segmentId = "";
            	data.jsonQueryRules = jsonQueryRules;
            	data.beginFilterDate = beginFilterDate;
            	data.endFilterDate = endFilterDate;
            	console.log(data)
            	return JSON.stringify(data);
            }
        }
        
        var columnDef =  [
        	{
                "render": function (data, type, row) {
                	var name = 'Anonymous Person';
                	try {
                		if(row.firstName.length > 0 && row.lastName.length > 0){
                    		name = textTruncate(row.firstName + ' ' + row.lastName,30);
                    	}
            		}
            		catch(err) {
            		   console.log(err)
            		}
                	
                    var callJsViewStr = "#calljs-leoCdpRouter('Customer_Profile_Info','" + row.id + "')";
                    return '<a target="_blank" title="Profile Report" href="' + callJsViewStr + '" >' + name + '</a>';
                },
                "targets": 0
            },
        	{
                "render": function (data, type, row) {
                    return '<div class="datatable_text">'  + data + '</div>';
                },
                "targets": 1
            },
            {
                "render": function (data, type, row) {
                	var genderText = "No information";
                	if(data === 0){
                		genderText = "Female";
                	}
                	else if(data === 1){
                		genderText = "Male";
                	}
                	else if(data === 2){
                		genderText = "LGBT";
                	}
                    return '<div class="datatable_text">'  + genderText + '</div>';
                },
                "targets": 2
            },
        	{
                "render": function (data, type, row) {
                	var fullText = row.lastTouchpoint.name;
                    return '<div class="datatable_text" title="' + fullText + '" >'  + textTruncate(fullText, 30) + '</div>';
                },
                "targets": 3
            },
            {
                "render": function (data, type, row) {
                	//format email
                	if(data != null || data != ''){
                		var callJsViewStr = "#calljs-leoCdpRouter('Customer_Profile_Info','" + row.id + "')";
                    	var link = '<a title="Profile Report" href="' + callJsViewStr + '" >' + textTruncate(data, 25) + '</a>';
                    	return '<div class="datatable_text">'  + link + '</div>';
                	}
                	return '';
                },
                "targets": 4
            },
            {
                "render": function (data, type, row) {
                    return '<div class="datatable_text text-center">'  + new Number(data).toLocaleString() + '</div>';
                },
                "targets": 5
            },
            {
                "render": function (data, type, row) {
                    var date = moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                    return '<div class="small">'  + date + '</div>';
                },
                "targets": 6
            },
            {
                "render": function (data, type, row) {
                    var date = moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                    return '<div class="small">'  + date + '</div>';
                },
                "targets": 7
            }
        ];
    	
        $('#'+selectorId).DataTable({
        	"lengthMenu": [[20, 30, 50], [20, 30, 50]],
        	'processing': true,
            'serverSide': true,
            'searching': false,
            'serverMethod': 'POST',
            'ajax': {
                url: ajaxUrl,
                contentType: 'application/json',
                beforeSend: function (request) {
                    request.setRequestHeader("leouss", usersession);
                },
                data: paramsGetter
            },
            'columnDefs': columnDef,
            'columns': [{
                    "data": "firstName" // 0
                },
                {
                    "data": "age" // 1
                },
                {
                    "data": "gender" // 2
                },
                {
                    "data": "lastTouchpoint" // 3
                },
                {
                    "data": "primaryEmail" // 4
                },
                {
                    "data": "totalLeadScore" // 5
                },
                {
                    "data": "createdAt" // 6
                },
                {
                    "data": "updatedAt" // 7
                }
            ]
        });
    }
}    
