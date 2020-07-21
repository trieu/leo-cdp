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

LeoCdpAdmin.navFunctions.loadJourneyMapList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/journey/journey-map-list.html?admin=1', pageDomSelector, function () {
		$('#page_breadcrumb').html(breadcrumbHtml);
		initJourneyMapList();
    });
}

LeoCdpAdmin.navFunctions.loadCustomerTouchpointList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/journey/customer-touchpoint-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCustomerTouchpointList();
    });
}

LeoCdpAdmin.navFunctions.loadMediaChannelList = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/journey/media-channel-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initMediaChannelList();
    });
}



LeoCdpAdmin.navFunctions.loadDataObserverList  = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/journey/data-observer-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initDataObserverList();
    });
}

//###################### Unified Marketing Hub ######################

LeoCdpAdmin.navFunctions.loadMarketing360Dashboard = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/marketing-360-dashboard.html?admin=1', pageDomSelector, function () {
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

// Profile functions

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

// Segment functions

LeoCdpAdmin.navFunctions.loadAudienceSegmentList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/audience-segment-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initAudienceSegmentList();
    });
}


// Products and Services functions

LeoCdpAdmin.navFunctions.loadProductsAndServices = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/marketing/products-services-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProductsAndServices();
    });
}

LeoCdpAdmin.navFunctions.loadUnifiedMarketingHubApiManagement = function (breadcrumbHtml) {
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

LeoCdpAdmin.navFunctions.loadContentDashboard = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/content/content-dashboard.html?admin=1', pageDomSelector, function () {
		$('#page_breadcrumb').html(breadcrumbHtml);
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

// Post functions 

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

LeoCdpAdmin.navFunctions.loadContentHubApiManagement = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/subviews/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

// Category functions

LeoCdpAdmin.navFunctions.loadContentCategoryList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/content/category-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadDataCategoryList();
    });
}


function loadPagesOfCategory(catKey, catName) {
    LeoCdpAdmin.loadView('/view/subviews/content/page-list.html?admin=1', pageDomSelector, function () {
        loadPageList(catKey, catName);
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

//###################### Personalization AI Hub navigation ######################

LeoCdpAdmin.navFunctions.loadPersonalizationModels = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/personalization/personalization-model-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initPersonalizationModels();
    });
}

LeoCdpAdmin.navFunctions.loadPersonalizationWidgets = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/personalization/personalization-widget-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initPersonalizationWidgets();
    });
}

//###################### Customer Activation Hub navigation ######################

LeoCdpAdmin.navFunctions.loadCouponManagement = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/activation/coupon-management.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCouponManagement();
    });
}

LeoCdpAdmin.navFunctions.loadCouponReport = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/activation/coupon-report.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCouponReport(id);
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaigns = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/activation/email-campaign-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaigns();
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaignReport = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/activation/email-campaign-report.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaignReport(id);
    });
}

LeoCdpAdmin.navFunctions.loadEmailCampaignEditor = function(id, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/subviews/activation/email-campaign-editor.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initEmailCampaignEditor(id);
    });
}

//###################### System Management navigation ######################

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