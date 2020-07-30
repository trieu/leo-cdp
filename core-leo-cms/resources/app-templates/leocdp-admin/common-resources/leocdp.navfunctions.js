/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all navFunctions (router -> functionName) for LeoCdpAdmin.navRouters
 * 
 */

LeoCdpAdmin.navFunctions = {};

//###################### Analytics 360 Hub ######################

LeoCdpAdmin.navFunctions.loadMarketingDashboard = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/analytics/marketing-dashboard.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSalesDashboard();
    });
}

LeoCdpAdmin.navFunctions.loadContentDashboard = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/analytics/content-dashboard.html?admin=1', pageDomSelector, function () {
		$('#page_breadcrumb').html(breadcrumbHtml);
		initContentDashboard();
    });
}

//###################### Journey Data Hub ######################


LeoCdpAdmin.navFunctions.loadJourneyMapStudio = function(journeyId) {
	console.log('loadJourneyMapStudio ' + journeyId);
    LeoCdpAdmin.loadView('/view/modules/journey/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}

LeoCdpAdmin.navFunctions.loadJourneyMapList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/journey-map-list.html?admin=1', pageDomSelector, function () {
		$('#page_breadcrumb').html(breadcrumbHtml);
		initJourneyMapList();
    });
}

LeoCdpAdmin.navFunctions.loadCustomerTouchpointList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/customer-touchpoint-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCustomerTouchpointList();
    });
}

LeoCdpAdmin.navFunctions.loadMediaChannelList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/media-channel-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initMediaChannelList();
    });
}



LeoCdpAdmin.navFunctions.loadDataObserverList  = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/data-observer-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initDataObserverList();
    });
}

//###################### Customer Data Hub ######################


function loadCustomerDashboard() {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadCustomerDataObserver(){
	LeoCdpAdmin.loadView('/view/modules/customer/customer-data-observer.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

// Profile functions

LeoCdpAdmin.navFunctions.loadCustomerProfileList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-profile-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	loadDataProfileList();
    });
}

LeoCdpAdmin.navFunctions.loadCustomerProfileInfo = function (profileId , breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-profile-info.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfile360Analytics(profileId);
    });
}

LeoCdpAdmin.navFunctions.loadCustomerProfileEditor = function (profileId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-profile-editor.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProfileDataEditor(profileId);
    });
}

// Segment functions

LeoCdpAdmin.navFunctions.loadCustomerSegmentList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-segment-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCustomerSegmentList();
    });
}


// Products and Services functions

LeoCdpAdmin.navFunctions.loadProductsAndServices = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/products-services-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProductsAndServices();
    });
}

LeoCdpAdmin.navFunctions.loadUnifiedMarketingHubApiManagement = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}


function loadBusinessAnalytics360() {
	LeoCdpAdmin.loadView('/view/modules/in-development.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

//###################### Content Data Hub ######################



// Page functions 

function pageEditor(id, categoryKey) {
	 console.log('pageEditor');
	 document.title = 'Page Editor';
	
	 LeoCdpAdmin.loadView('/view/modules/content/page-editor.html?admin=1', pageDomSelector, function () {
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
	 LeoCdpAdmin.loadView('/view/modules/content/page-info-with-posts.html?admin=1', pageDomSelector, function () {
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
	         LeoAdminApiUtil.callPostAdminApi(urlStr, params, function (json) {
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

// Post functions 

function postEditor(id, pageId, categoryKey) {
	 console.log('postEditor' + id);
	 LeoCdpAdmin.loadView('/view/modules/content/post-editor.html?admin=1', pageDomSelector, function () {
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
	     LeoCdpAdmin.loadView('/view/modules/content/post-info.html?admin=1', pageDomSelector, function () {
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
	         LeoAdminApiUtil.callPostAdminApi(urlStr, params, function (json) {
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

LeoCdpAdmin.navFunctions.loadContentHubApiManagement = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

// Category functions

LeoCdpAdmin.navFunctions.loadContentCategoryList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/content/category-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataCategoryList();
    });
}


function loadPagesOfCategory(catKey, catName) {
    LeoCdpAdmin.loadView('/view/modules/content/page-list.html?admin=1', pageDomSelector, function () {
        loadPageList(catKey, catName);
    });
}


function loadCategoryForm(id) {
    LeoCdpAdmin.loadView('/view/modules/content/category-form.html?admin=1', pageDomSelector, function () {
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
	LeoCdpAdmin.loadView('/view/modules/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

//###################### Personalization AI Hub navigation ######################

LeoCdpAdmin.navFunctions.loadPersonalizationModels = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/personalization/personalization-model-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initPersonalizationModels();
    });
}

LeoCdpAdmin.navFunctions.loadPersonalizationWidgets = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/personalization/personalization-widget-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initPersonalizationWidgets();
    });
}

//###################### Customer Activation Hub navigation ######################

LeoCdpAdmin.navFunctions.loadCouponManagement = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/coupon-management.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCouponManagement();
    });
}

LeoCdpAdmin.navFunctions.loadCouponReport = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/coupon-report.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCouponReport(id);
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaigns = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/email-campaign-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaigns();
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaignReport = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/email-campaign-report.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaignReport(id);
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaignEditor = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/email-campaign-editor.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaignEditor(id);
    });
}

//###################### System Management navigation ######################

LeoCdpAdmin.navFunctions.loadUserLoginList = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/system/user-login-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataUserList();
    });
}

LeoCdpAdmin.navFunctions.loadUserLoginEditor = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/system/user-login-editor.html?admin=1', pageDomSelector, function () {
        // load data from API
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataUserProfile(id);
    });
}

LeoCdpAdmin.navFunctions.loadMyLoginInfo = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/system/user-login-info.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initMyLoginInfo();
    });
}


LeoCdpAdmin.navFunctions.loadSystemInfoConfigs = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/system/system-info-configs.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        systemManagementReady();
    });
}