
// ###################### Business Hub ######################

function loadCustomer360Analytics() {
    loadView('/view/hubs/business/sales-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadJourneyMapStudio() {
    loadView('/view/hubs/business/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}

function loadProductCatalogManagement(){
	loadView('/view/hubs/business/product-catalog.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadServiceCatalogManagement(){
	loadView('/view/hubs/business/service-catalog.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadMarketingHubApiManagement(){
	loadView('/view/hubs/in-development.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

function loadBusinessAnalytics360() {
	loadView('/view/hubs/in-development.html?admin=1', pageDomSelector, function () {
		//TODO
    });
}

//###################### Content Hub ######################

function loadContentDashboard() {
	document.title = 'Content Dashboard';
	loadView('/view/hubs/content/content-dashboard.html?admin=1', pageDomSelector, function () {
		initContentDashboard();
    });
}

//------------ Page Controllers ---------------------

function pageEditor(id, categoryKey) {
	 console.log('pageEditor');
	 document.title = 'Page Editor';
	
	 loadView('/view/page-editor.html?admin=1', pageDomSelector, function () {
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
	 loadView('/view/page-info-with-posts.html?admin=1', pageDomSelector, function () {
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
	 loadView('/view/post/post-editor.html?admin=1', pageDomSelector, function () {
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
	     loadView('/view/post/post-info.html?admin=1', pageDomSelector, function () {
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
	loadView('/view/hubs/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

//------------ Category Controllers ---------------------


function loadPagesOfCategory(catKey, catName) {
    loadView('/view/page-list.html?admin=1', pageDomSelector, function () {
        loadPageList(catKey, catName);
    });
}

function loadCategoryList() {
    loadView('/view/category-list.html?admin=1', pageDomSelector, function () {
        loadDataCategoryList();
    });
}

function loadSystemManagement() {
    loadView('/view/system-management.html?admin=1', pageDomSelector, function () {
        systemManagementReady();
    });
}

function loadCategoryForm(id) {
    loadView('/view/category-form.html?admin=1', pageDomSelector, function () {
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
	loadView('/view/hubs/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}


//###################### Audience Hub ######################

function loadAudienceDashboard() {
    loadView('/view/hubs/audience/audience-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadAudienceDataObserver(){
	loadView('/view/hubs/audience/audience-data-observer.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}

function loadAudienceProfiles() {
    loadView('/view/hubs/audience/audience-profile-list.html?admin=1', pageDomSelector, function () {
    	loadDataProfileList();
    });
}

function loadAudienceSegmentation() {
    loadView('/view/hubs/audience/audience-segment-list.html?admin=1', pageDomSelector, function () {
    	//TODO
    });
}


function loadAudienceHubApiManagement(){
	loadView('/view/hubs/in-development.html?admin=1', pageDomSelector, function () {
        //TODO
    });
}



function loadProfile360Analytics() {
    loadView('/view/hubs/audience/profile-360-analytics.html?admin=1', pageDomSelector, function () {
    	initProfile360Analytics();
    });
}

function loadProfileDataEditor() {
    loadView('/view/hubs/audience/profile-data-editor.html?admin=1', pageDomSelector, function () {
    	initProfileDataEditor();
    });
}



// ------------ Report Analytics Controllers ---------------------



function loadContentReport() {
    loadView('/view/report/content-report.html?admin=1', pageDomSelector, function () {

    });
}



function loadUserReport() {
    loadView('/view/report/user-report.html?admin=1', pageDomSelector, function () {
        loadDataUserAnalytics();
    });
}

//###################### User Controllers ######################

function loadUserList() {
    loadView('/view/user-list.html?admin=1', pageDomSelector, function () {
        loadDataUserList();
    });
}

function loadUserProfileForm(id) {
    loadView('/view/user-form.html?admin=1', pageDomSelector, function () {
        if (id) {
            // load from API
            loadDataUserProfile(id);
        } else {
            // create new
            loadDataUserProfile(false);
        }
    });
}

