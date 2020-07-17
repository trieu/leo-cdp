/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all navFunctions (router -> functionName) for LeoCdpAdmin.navRouters
 * 
 */

LeoCdpAdmin.navFunctions = {};

//###################### Customer Journey Map ######################


LeoCdpAdmin.navFunctions.loadJourneyMapStudio = function(journeyId) {
	console.log('loadJourneyMapStudio ' + journeyId);
    LeoCdpAdmin.loadView('/view/subviews/journey/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}

function loadJourneyMaps(){
	LeoCdpAdmin.loadView('/view//subviews/journey/journey-maps.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}


//###################### Unified Marketing Hub ######################

LeoCdpAdmin.navFunctions.loadMarketing360Dashboard = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/marketing-360-dashboard.html?admin=1', pageDomSelector, function () {
    	console.log("breadcrumbHtml" + breadcrumbHtml)
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSalesDashboard();
    });
}

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

// BEGIN Profile functions

LeoCdpAdmin.navFunctions.loadAudienceProfileList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-profile-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	loadDataProfileList();
    });
}

LeoCdpAdmin.navFunctions.loadAudienceProfileReport = function (profileId , breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-profile-report.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfile360Analytics(profileId);
    });
}

LeoCdpAdmin.navFunctions.loadAudienceProfileEditor = function (profileId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-profile-editor.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfileDataEditor(profileId);
    });
}

//END Profile functions

//BEGIN Segment functions

LeoCdpAdmin.navFunctions.loadAudienceSegmentation = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-segment-list.html?admin=1', pageDomSelector, function () {
    	//TODO
    });
}

//END Segment functions


LeoCdpAdmin.navFunctions.loadAudienceHubApiManagement = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
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

// Page functions 

function pageEditor(id, categoryKey) {
	 console.log('pageEditor');
	 document.title = 'Page Editor';
	
	 LeoCdpAdmin.loadView('/view/subviews/content/page-editor.html?admin=1', pageDomSelector, function () {
	     if (id) {
	         console.log('edit page ' + id);
	         loadDataPageEditor({ 'pageId': id,'categoryKey': categoryKey })
	     } else {
	         console.log('new page');
	         loadDataPageEditor({ 'pageId': "", 'categoryKey': categoryKey })
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

//Post functions 

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
	     	initPostInfoView({ postId: id });
	     });
	 }
}

function deletePost() {
	 $('#delete_callback').val('');
	 $('#confirmDeleteDialog').modal({ focus: true });
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