/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functional web-app routers for CDP end-users
 * 
 */

LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"menuName" : "Marketing 360 Dashboard",
			"functionName" : "loadMarketing360Dashboard",
			"breadcrumb" : ["Unified Marketing Hub", "Marketing 360 Dashboard"]
		},
		
		// 1.1 Targeted Persona
		"Customer_Persona_List" : {
			"menuName" : "Customer Persona List",
			"functionName" : "loadCustomerPersonaList",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List"]
		},
		"Customer_Persona_Report" : {
			"menuName" : "Customer Persona Report",
			"functionName" : "loadCustomerPersonaReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List", "Customer Persona Report"]
		},
		"Customer_Persona_Details" : {
			"menuName" : "Customer Persona Details",
			"functionName" : "loadCustomerPersonaDetails",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List", "Customer Persona Details"]
		},
		
		// 1.2 Journey Map List, Report and Editor
		"Customer_Journey_List" : {
			"menuName" : "Customer Journey List",
			"functionName" : "loadCustomerJourneyList",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List"]
		},
		"Journey_Map_Report" : {
			"menuName" : "Journey Map Report",
			"functionName" : "loadJourneyMapReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List", "Journey Map Report"]
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List","Journey Map Studio"]
		},
		
		// 1.3 Customer Touchpoint
		"Customer_Touchpoint_List" : {
			"menuName" : "Customer Touchpoint List",
			"functionName" : "loadCustomerTouchpointList",
			"breadcrumb" : ["Customer Journey Map", "Touchpoint List"]
		},
		"Customer_Touchpoint_Report" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointReport",
			"breadcrumb" : ["Customer Journey Map", "Touchpoint List" , "Touchpoint Report" ]
		},
		
		// 1.4 Data Observer for touchpoint
		"Data_Observer_List" : {
			"menuName" : "Data Observer List",
			"functionName" : "loadDataObserverList",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List"]
		},
		"Data_Observer_Report" : {
			"menuName" : "Data Observer Report",
			"functionName" : "loadDataObserverReport",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List", "Data Observer Report"]
		},
		"Data_Observer_Datails" : {
			"menuName" : "Data Observer Details",
			"functionName" : "loadDataObserverDetails",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List", "Data Observer Details"]
		},
		
		// 2.1 Unified Marketing Hub
		"Marketing_360_Dashboard": {
			"menuName" : "Marketing 360 Dashboard",
			"functionName" : "loadMarketing360Dashboard",
			"breadcrumb" : ["Unified Marketing Hub", "Marketing 360 Dashboard"]
		},
		
		// 2.2 Audience Profile 
		"Audience_Profile_List" : {
			"menuName" : "Audience Profile List",
			"functionName" : "loadAudienceProfileList",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List"]
		},
		"Audience_Profile_Report" : {
			"menuName" : "Data Profile Report",
			"functionName" : "loadAudienceProfileReport",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List", "Audience Profile Report"]
		},
		"Audience_Profile_Editor" : {
			"menuName" : "Audience Profile Editor",
			"functionName" : "loadAudienceProfileEditor",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List", "Audience Profile Details"]
		},
		
		// 2.3 Audience Segmentation
		"Audience_Segment_List" : {
			"menuName" : "Audience Segment List",
			"functionName" : "loadAudienceSegmentList",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List"]
		},
		"Audience_Segment_Report" : {
			"menuName" : "Audience Segment Report",
			"functionName" : "loadAudienceSegmentReport",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List", "Audience Segment Report"]
		},
		"Audience_Segment_Editor" : {
			"menuName" : "Audience Segment Editor",
			"functionName" : "loadAudienceSegmentEditor",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List", "Audience Segment Editor"]
		},
		
		// 2.4 Product and Service Catalog
		"Products_Services_List" : {
			"menuName" : "Products/Services List",
			"functionName" : "",
			"breadcrumb" : ["Unified Marketing Hub", "Product & Service Catalog"]
		},
		"" : {
			"menuName" : "",
			"functionName" : "",
			"breadcrumb" : ["Unified Marketing Hub", "Product & Service Catalog", "Product Report"]
		},
		"" : {
			"menuName" : "",
			"functionName" : "",
			"breadcrumb" : ["Unified Marketing Hub", "Product & Service Catalog", "Service Report"]
		},
		"" : {
			"menuName" : "",
			"functionName" : "",
			"breadcrumb" : ["Unified Marketing Hub", "Product & Service Catalog", "Product Information Editor"]
		},
		"" : {
			"menuName" : "",
			"functionName" : "",
			"breadcrumb" : ["Unified Marketing Hub", "Product & Service Catalog", "Service Information Editor"]
		},
		
		// 3.1 Creative Content Hub
		"Content_Category_List" : {
			"menuName" : "Content Category List",
			"functionName" : "loadContentCategoryList",
			"breadcrumb" : ["Creative Content Hub", "Content Category List"]
		},
		
		// 4.1 Personalization AI Model & Widget Hub
		"Personalization_AI_Models" : {
			"menuName" : "Personalization AI Models",
			"functionName" : "loadPersonalizationAIModels",
			"breadcrumb" : ["Personalization AI Hub", "Personalization AI Models"]
		},
		"Personalization_Widgets" : {
			"menuName" : "Personalization Widget",
			"functionName" : "loadPersonalizationWidgetList",
			"breadcrumb" : ["Personalization AI Hub", "Personalization Widgets"]
		},
		
		// 5.1 Email Marketing Activation Campaigns
		"Email_Campaigns" : {
			"menuName" : "Email Campaign List",
			"functionName" : "loadEmailCampaigns",
			"breadcrumb" : ["Marketing Activation", "Email Campaigns"]
		},
		"Email_Campaign_Report" : {
			"menuName" : "Email Campaign Report",
			"functionName" : "loadEmailCampaignReport",
			"breadcrumb" : ["Marketing Activation", "Email Campaigns", "Email Campaign Report"]
		},
		"Email_Campaign_Editor" : {
			"menuName" : "Email Campaign Editor",
			"functionName" : "loadEmailCampaignEditor",
			"breadcrumb" : ["Marketing Activation", "Email Campaigns", "Email Campaign Editor"]
		},
		
		// User Login Management
		"User_Login_List" : {
			"menuName" : "User Login List",
			"functionName" : "loadUserLoginList",
			"breadcrumb" : ["System Management", "User Login List"]
		},
		"User_Login_Editor" : {
			"menuName" : "User Login Editor",
			"functionName" : "loadUserLoginEditor",
			"breadcrumb" : ["System Management", "User Login List","User Login Profile Editor"]
		},
		"System_Configuration" : {
			"menuName" : "System Configuration",
			"functionName" : "loadSystemInfoConfigs",
			"breadcrumb" : ["System Management", "System Configuration"]
		}
};


function leoCdpRouter(objKey,objId){
	var obj = LeoCdpAdmin.navRouters[objKey];
	console.log( obj );
	
	// generate breadcrumb navigation
	var breadcrumbHtml = '';
	var breadcrumbList = obj.breadcrumb;
	var len = breadcrumbList.length;
	for(var i=0; i< len; i++ ){
		var name = breadcrumbList[i];
		var key = name.replace(/ /g, "_");
		var jsFunc = LeoCdpAdmin.navRouters[key] ? "leoCdpRouter('"+ key + "')"  : "";
		breadcrumbHtml = breadcrumbHtml + '<a href="#calljs-' + jsFunc + '"> ' + breadcrumbList[i] + ' </a> ';
		if( i < (len - 1) ){
			breadcrumbHtml = breadcrumbHtml + ' &#8594; ';
		}
	}
	
	var vf = LeoCdpAdmin.navFunctions[obj.functionName];
	
	if(typeof vf === 'function') {
		if(objId){
			console.log(objKey + " objId " + objId)
			vf.apply(null,[objId,breadcrumbHtml]);
		} else {
			console.log(objKey + " ")
			vf.apply(null,[breadcrumbHtml]);
		}
	} else {
		console.error( " LeoCdpAdmin.navFunctions[obj.functionName] is not a function " );
		console.error( obj );
	}
	console.log( objId );
}

LeoCdpAdmin.navFunctions = {};

function loadJourneyMaps(){
	LeoCdpAdmin.loadView('/view//subviews/journey/journey-maps.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

// ###################### Business Hub ######################

LeoCdpAdmin.navFunctions.loadMarketing360Dashboard = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/marketing-360-dashboard.html?admin=1', pageDomSelector, function () {
    	console.log("breadcrumbHtml" + breadcrumbHtml)
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSalesDashboard();
    });
}

LeoCdpAdmin.navFunctions.loadJourneyMapStudio = function(journeyId) {
	console.log('loadJourneyMapStudio ' + journeyId);
    LeoCdpAdmin.loadView('/view/subviews/journey/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}

function loadProductCatalogManagement(){
	LeoCdpAdmin.loadView('/view/subviews/business/product-catalog.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadServiceCatalogManagement(){
	LeoCdpAdmin.loadView('/view/subviews/business/service-catalog.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadMarketingHubApiManagement(){
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadBusinessAnalytics360() {
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

//###################### Content Hub ######################

function loadContentDashboard() {
	document.title = 'Content Dashboard';
	LeoCdpAdmin.loadView('/view/subviews/content/content-dashboard.html?admin=1', pageDomSelector, function () {
		initContentDashboard();
    });
}

//------------ Page Controllers ---------------------

function pageEditor(id, categoryKey) {
	 console.log('pageEditor');
	 document.title = 'Page Editor';
	
	 LeoCdpAdmin.loadView('/view/subviews/content/page-editor.html?admin=1', pageDomSelector, function () {
	     if (id) {
	         console.log('edit page ' + id);
	         loadDataPageEditor({
	             'pageId': id,
	             'categoryKey': categoryKey
	         })
	     } else {
	         console.log('new page');
	         loadDataPageEditor({
	             'pageId': "",
	             'categoryKey': categoryKey
	         })
	     }
	 });
}

function pageInfo(pageId, pageName, categoryKey) {
	 document.title = 'Page Info: ' + decodeURIComponent(pageName);
	 console.log('pageInfo');
	 LeoCdpAdmin.loadView('/view/subviews/content/page-info-with-posts.html?admin=1', pageDomSelector, function () {
	     pageInfoCallback(pageId, pageName, categoryKey);
	 });
}

function deletePage() {
	 $('#delete_callback').val('');
	 $('#confirmDeleteDialog').modal({
	     focus: true
	 });
	 if (pageModel) {
	     var callback = "deletePage" + pageModel.id;
	     window[callback] = function () {
	         var urlStr = baseAdminApi + '/page/delete';
	         var params = {
	             'pageId': pageModel.id
	         };
	         LeoCmsApiUtil.callPostAdminApi(urlStr, params, function (json) {
	             if (json.httpCode === 0 && json.errorMessage === '') {
	                 if (json.data) {
	                     location.href = '/admin';
	                 }
	             }
	         });
	     }
	     $('#delete_callback').val(callback);
	     $('#deletedInfoTitle').html(pageModel.title);
	     $('#deletedInfoMsg').html('Do you want to delete this page ?');
	 }
}

//------------ Post Controllers ---------------------

function postEditor(id, pageId, categoryKey) {
	 console.log('postEditor' + id);
	 LeoCdpAdmin.loadView('/view/subviews/content/post-editor.html?admin=1', pageDomSelector, function () {
	     console.log('edit post ' + id);
	     initPostEditor({
	         'postId': id,
	         'pageId': pageId,
	         'categoryKey': categoryKey
	     });
	 });
}

function postInfo(id) {
	 if (id) {
	     LeoCdpAdmin.loadView('/view/subviews/content/post-info.html?admin=1', pageDomSelector, function () {
	     	initPostInfoView({
	             postId: id
	         });
	     });
	 }
}

function deletePost() {
	 $('#delete_callback').val('');
	 $('#confirmDeleteDialog').modal({
	     focus: true
	 });
	 if (postModel) {
	     var callback = "deletePost" + postModel.id;
	     window[callback] = function () {
	         var urlStr = baseAdminApi + '/post/delete';
	         var params = {
	             'postId': postModel.id
	         };
	         LeoCmsApiUtil.callPostAdminApi(urlStr, params, function (json) {
	             if (json.httpCode === 0 && json.errorMessage === '') {
	                 if (json.data) {
	                     location.href = '/admin';
	                 }
	             }
	         });
	     }
	     $('#delete_callback').val(callback);
	     $('#deletedInfoTitle').html(postModel.title);
	     $('#deletedInfoMsg').html('Do you want to delete this post ?');
	 }
}


function loadContentHubApiManagement(){
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

//------------ Category Controllers ---------------------


function loadPagesOfCategory(catKey, catName) {
    LeoCdpAdmin.loadView('/view/subviews/content/page-list.html?admin=1', pageDomSelector, function () {
        loadPageList(catKey, catName);
    });
}

function loadCategoryList() {
    LeoCdpAdmin.loadView('/view/subviews/content/category-list.html?admin=1', pageDomSelector, function () {
        loadDataCategoryList();
    });
}



function loadCategoryForm(id) {
    LeoCdpAdmin.loadView('/view/subviews/content/category-form.html?admin=1', pageDomSelector, function () {
        if (id) {
            // load from API
            loadDataCategoryInfo(id);
        } else {
            // create new
            loadDataCategoryInfo(false);
        }
    });
}

function loadMediaMarketplace(){
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}


//###################### Audience Hub ######################

function loadAudienceDashboard() {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadAudienceDataObserver(){
	LeoCdpAdmin.loadView('/view/subviews/marketing/audience-data-observer.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

LeoCdpAdmin.navFunctions.loadAudienceProfileList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-profile-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	loadDataProfileList();
    });
}

LeoCdpAdmin.navFunctions.loadAudienceSegmentation = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-segment-list.html?admin=1', pageDomSelector, function () {
    	//TODO
    });
}


LeoCdpAdmin.navFunctions.loadAudienceHubApiManagement = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

LeoCdpAdmin.navFunctions.loadAudienceProfileReport = function (profileId , breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/profile-360-analytics.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfile360Analytics(profileId);
    });
}

LeoCdpAdmin.navFunctions.loadAudienceProfileEditor = function (profileId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/profile-data-editor.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfileDataEditor(profileId);
    });
}


//###################### System Management Controllers ######################

LeoCdpAdmin.navFunctions.loadUserLoginList = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/system/user-login-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataUserList();
    });
}

LeoCdpAdmin.navFunctions.loadUserLoginEditor = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/system/user-login-editor.html?admin=1', pageDomSelector, function () {
        // load data from API
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataUserProfile(id);
    });
}

LeoCdpAdmin.navFunctions.loadSystemInfoConfigs = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/system/system-info-configs.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        systemManagementReady();
    });
}