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

var loadSegmentBuilder = window.loadSegmentBuilder || function(jsonQueryRules, readOnlyMode, callback) {
	
	var dataFilter = [ {
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
	    id: 'behavioral_event',
	    label: 'Behavioral Event',
	    type: 'string',
	    input: 'select',
	    values: {
	      "content_view": 'Content View',
	      "product_view": 'Product View',
	      "social_login": 'Customer Login',
	      "add_to_cart": 'Purchase Intent',
	      "buy": 'First Purchase',
	      "feedback_1st": 'First-time Feedback',
	      "social_sharing": 'Social Sharing',
	      "rebuy": 'Repeat Purchase',
	      "feedback_2nd": 'Second-time Feedback',
	    },
	    operators: ['equal', 'is_empty']
	  } 
	];
	
	var rulesOfQuery = jsonQueryRules || false;

	$('#segment-builder-holder').queryBuilder({
		plugins : [ 'bt-tooltip-errors' ],
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

// 
var loadProfilesInSegment = window.loadProfilesInSegment || function(segmentId) {
	$('#profile-list-panel').show();
    var usersession = getUserSession();
    if (usersession) {
    	
    	var urlGetProfilesBySegmentId = baseAdminApi + '/cdp/segment/profiles';
    	
        $('#profile-list').DataTable({
        	"lengthMenu": [[20, 30, 50], [20, 30, 50]],
        	'processing': true,
            'serverSide': true,
            'searching': false,
            'serverMethod': 'POST',
            'ajax': {
                url: urlGetProfilesBySegmentId,
                contentType: 'application/json',
                beforeSend: function (request) {
                    request.setRequestHeader("leouss", usersession);
                },
                data: function (data) {
                	data.segmentId = segmentId;
                	return JSON.stringify(data);
                }
            },
            'columnDefs': [
            	{
                    "render": function (data, type, row) {
                    	var name = 'Anonymous Person';
                    	if(row.firstName.length > 0 && row.lastName.length > 0){
                    		name = textTruncate(row.firstName + ' ' + row.lastName,30);
                    	}
                        var callJsViewStr = "#calljs-leoCdpRouter('Customer_Profile_Info','" + row.id + "')";
                        return '<a target="_blank" title="Profile Report" href="' + callJsViewStr + '" >' + name + '</a>';
                    },
                    "targets": 0
                },
            	{
                    "render": function (data, type, row) {
                        return data;
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
                        return '<div class="datatable_text">'  + genderText + '</div>';
                    },
                    "targets": 2
                },
            	{
                    "render": function (data, type, row) {
                        return '<div class="datatable_text">'  + textTruncate(row.lastTouchpoint.name, 30) + '</div>';
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
                        var date = moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                        return '<div class="datatable_text">'  + date + '</div>';
                    },
                    "targets": 6
                },
                {
                    "render": function (data, type, row) {
                        var date = moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss');
                        return '<div class="datatable_text">'  + date + '</div>';
                    },
                    "targets": 7
                }
            ],
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
                    "data": "primaryPhone" // 5
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