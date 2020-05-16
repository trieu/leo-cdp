
// ###################### Business Hub ######################

function loadSalesDashboard() {
    loadView('/view/hubs/business/sales-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadJourneyMapDesigner() {
    loadView('/view/hubs/business/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}

//###################### Content Hub ######################

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

//------------ Category Controllers ---------------------

function loadCategoryNavigation() {
    LeoCmsApiUtil.callPostAdminApi(baseAdminApi + '/category/list-all', {}, function (rs) {
        if (rs.data && rs.httpCode === 0) {
            var raw_template = $('#category-navigation-tpl').html();
            var template = Handlebars.compile(raw_template);
            var placeHolder = $('#content_hub_menu');
            rs.data.forEach(function (e) {
                //console.log(e);	
                //e.name = toTitleCase(e.name);
                var html = template(e);
                placeHolder.append(html);
            });
            $('[title]').tooltip();
        }
    });
}

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


//###################### Audience Hub ######################

function loadAudienceDashboard() {
    loadView('/view/hubs/audience/audience-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
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