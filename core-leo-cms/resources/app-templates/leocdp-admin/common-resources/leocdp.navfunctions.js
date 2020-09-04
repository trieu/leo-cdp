/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all navFunctions (router -> functionName) for LeoCdpAdmin.navRouters
 * 
 */

LeoCdpAdmin.navFunctions = {};

//###################### USPA Knowledge Hub ######################

LeoCdpAdmin.navFunctions.loadSelfLearningCourses = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/knowledge/self-learning-courses.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSelfLearningCourses();
    });
}

//###################### Analytics 360 Hub ######################

LeoCdpAdmin.navFunctions.loadPrimaryDashboard = function(breadcrumbHtml) {
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

LeoCdpAdmin.navFunctions.loadDataScienceNotebooks = function (breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/analytics/data-science-notebooks.html?admin=1', pageDomSelector, function () {
		$('#page_breadcrumb').html(breadcrumbHtml);
		initAnalytics360Notebooks();
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

LeoCdpAdmin.navFunctions.loadMediaJourneyMap = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/media-journey-map.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initMediaJourneyMap();
    });
}

LeoCdpAdmin.navFunctions.loadDataJourneyFunnel = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/data-journey-funnel.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initBehavioralEventList();
    });
}	


LeoCdpAdmin.navFunctions.loadLeoObserverList  = function(breadcrumbHtml) {
	LeoCdpAdmin.loadView('/view/modules/journey/leo-observer-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initDataObserverList();
    });
}

//--- Products and Services functions ---

LeoCdpAdmin.navFunctions.loadProductsAndServices = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/products-services-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initProductsAndServices();
    });
}

//###################### Customer Data Hub ######################

// --- Customer Profile functions ---

LeoCdpAdmin.navFunctions.loadCustomerProfileList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-profile-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	loadDataProfileList();
    });
}

LeoCdpAdmin.navFunctions.loadCustomerProfileInfo = function (profileId, breadcrumbHtml) {
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

LeoCdpAdmin.navFunctions.loadCustomerActivation = function (profileId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-activation.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initCustomerActivation(profileId);
    });
}

// --- Customer Segment functions ---

LeoCdpAdmin.navFunctions.loadSegmentList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/segment-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSegmentList();
    });
}

LeoCdpAdmin.navFunctions.loadSegmentBuilder = function (segmentId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/segment-builder.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSegmentBuilder(segmentId);
    });
}

LeoCdpAdmin.navFunctions.loadSegmentDetails = function (segmentId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/segment-details.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSegmentDetails(segmentId);
    });
}

LeoCdpAdmin.navFunctions.loadSegmentActivation = function (segmentId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/segment-activation.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initSegmentActivation(segmentId);
    });
}

// --- Customer Data Import and Export functions ---

LeoCdpAdmin.navFunctions.loadCustomerDataImport = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-data-import.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    });
}

LeoCdpAdmin.navFunctions.loadCustomerDataExport = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/customer/customer-data-export.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    });
}

//###################### Creative Content Hub ######################

// --- Category functions ---

LeoCdpAdmin.navFunctions.loadContentCategoryList = function (breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/content/category-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initContentCategoryList();
    });
}

LeoCdpAdmin.navFunctions.loadPagesInCategory = function(catKey, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/content/page-list.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
        loadPageList(catKey);
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

// --- Page functions ---

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

LeoCdpAdmin.navFunctions.loadPageInfo = function(pageId, breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/content/page-info-with-posts.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	 pageInfoCallback(pageId);
    });
}

LeoCdpAdmin.navFunctions.deletePage = function(pageModel) {
	 $('#delete_callback').val('');
	 $('#confirmDeleteDialog').modal({ focus: true });
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
	                     location.hash = 'calljs-leoCdpRouter("Content_Category_List")';
	                 }
	             }
	         });
	     }
	     $('#delete_callback').val(callback);
	     $('#deletedInfoTitle').html(pageModel.title);
	     $('#deletedInfoMsg').html('Do you want to delete this page ?');
	 }
}

// --- Post functions ---

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

LeoCdpAdmin.navFunctions.loadPostInfo = function(id, breadcrumbHtml) {
	 if (id) {
	     LeoCdpAdmin.loadView('/view/modules/content/post-info.html?admin=1', pageDomSelector, function () {
	    	$('#page_breadcrumb').html(breadcrumbHtml);
	     	initPostInfoView({ postId: id });
	     });
	 }
}

LeoCdpAdmin.navFunctions.deletePost = function(postModel) {
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
	                	 location.hash = 'calljs-leoCdpRouter("Content_Category_List")';
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

function loadMediaMarketplace(){
	LeoCdpAdmin.loadView('/view/modules/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

//###################### Customer Activation ######################

LeoCdpAdmin.navFunctions.loadActivationRules = function(breadcrumbHtml) {
    LeoCdpAdmin.loadView('/view/modules/activation/activation-rules.html?admin=1', pageDomSelector, function () {
    	$('#page_breadcrumb').html(breadcrumbHtml);
    	initActivationRules();
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