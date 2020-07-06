
LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"functionName" : "loadMarketing360Report"
		},
		"Customer_Personas" : {
			"menuName" : "Customer Personas",
			"functionName" : "loadCustomerPersonas",
			"breadcrumb" : ["Customer_Journey_Hub", "Customer_Personas"]
		},
		"Journey_Maps" : {
			"menuName" : "Journey Maps",
			"functionName" : "loadJourneyMaps",
			"breadcrumb" : ["Customer_Journey_Hub", "Journey_Maps"]
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer_Journey_Hub", "Journey_Maps","Journey_Map_Studio"]
		},
		"User_Login_List" : {
			"menuName" : "User Login List",
			"functionName" : "loadUserLoginList",
			"breadcrumb" : ["System Management", "User Login Management"]
		},
		"User_Login_Editor" : {
			"menuName" : "User Login Editor",
			"functionName" : "loadUserLoginEditor",
			"breadcrumb" : ["System Management", "User Login Management"]
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
	var breadcrumbHtml = '<span> Business Hub </span> &#8594; <span> Sales Dashboard </span>';
	if(objId){
		console.log(objKey + " objId " + objId)
		LeoCdpAdmin.navFunctions[obj.functionName].apply(null,[objId,breadcrumbHtml]);
	} else {
		console.log(objKey + " ")
		LeoCdpAdmin.navFunctions[obj.functionName].apply(null,[breadcrumbHtml]);
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

LeoCdpAdmin.navFunctions.loadMarketing360Report = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/marketing-360-report.html?admin=1', pageDomSelector, function () {
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
	
	 LeoCdpAdmin.loadView('/view/page-editor.html?admin=1', pageDomSelector, function () {
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
	 LeoCdpAdmin.loadView('/view/page-info-with-posts.html?admin=1', pageDomSelector, function () {
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
	 LeoCdpAdmin.loadView('/view/post/post-editor.html?admin=1', pageDomSelector, function () {
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
	     LeoCdpAdmin.loadView('/view/post/post-info.html?admin=1', pageDomSelector, function () {
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
    LeoCdpAdmin.loadView('/view/page-list.html?admin=1', pageDomSelector, function () {
        loadPageList(catKey, catName);
    });
}

function loadCategoryList() {
    LeoCdpAdmin.loadView('/view/category-list.html?admin=1', pageDomSelector, function () {
        loadDataCategoryList();
    });
}



function loadCategoryForm(id) {
    LeoCdpAdmin.loadView('/view/category-form.html?admin=1', pageDomSelector, function () {
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
    LeoCdpAdmin.loadView('/view/subviews/audience/audience-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadAudienceDataObserver(){
	LeoCdpAdmin.loadView('/view/subviews/audience/audience-data-observer.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

function loadAudienceProfiles() {
    LeoCdpAdmin.loadView('/view/subviews/audience/audience-profile-list.html?admin=1', pageDomSelector, function () {
    	loadDataProfileList();
    });
}

function loadAudienceSegmentation() {
    LeoCdpAdmin.loadView('/view/subviews/audience/audience-segment-list.html?admin=1', pageDomSelector, function () {
    	//TODO
    });
}


function loadAudienceHubApiManagement(){
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}



function loadProfile360Analytics() {
    LeoCdpAdmin.loadView('/view/subviews/audience/profile-360-analytics.html?admin=1', pageDomSelector, function () {
    	initProfile360Analytics();
    });
}

function loadProfileDataEditor() {
    LeoCdpAdmin.loadView('/view/subviews/audience/profile-data-editor.html?admin=1', pageDomSelector, function () {
    	initProfileDataEditor();
    });
}


//###################### System Management Controllers ######################

LeoCdpAdmin.navFunctions.loadUserLoginList = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/system/user-login-list.html?admin=1', pageDomSelector, function () {
        loadDataUserList();
    });
}

LeoCdpAdmin.navFunctions.loadUserLoginEditor = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/system/user-login-editor.html?admin=1', pageDomSelector, function () {
        // load data from API
        loadDataUserProfile(id);
    });
}

LeoCdpAdmin.navFunctions.loadSystemInfoConfigs = function() {
    LeoCdpAdmin.loadView('/view/subviews/system/system-info-configs.html?admin=1', pageDomSelector, function () {
        systemManagementReady();
    });
}