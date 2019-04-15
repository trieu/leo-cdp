var prefixCallJs = '#calljs-';
var pageDomSelector = '#page-wrapper';
window.apiCacheEnabled = false;

$(document).ready(function () {
    if (LeoCmsApiUtil.isLoginSessionOK()) {
        var defaultPath = '/view/navigation-view.html?admin=1';

        //find action js
        var idx = location.hash.indexOf(prefixCallJs);
        if (idx >= 0) {
            loadView(defaultPath, '#wrapper', function () {
                mainViewReady();
                setTimeout(function () {
                    try {
                        var jsCode = decodeURIComponent(location.hash.substring(idx + prefixCallJs.length).trim());
                        if (jsCode != '') {
                            eval(jsCode);
                        }
                        $('#page-wrapper').show();
                    } catch (error) {
                        alert(error);
                        location.href = '/admin';
                    }
                }, 600);
            });
        } else {
            var uri = location.hash.length === 0 ? defaultPath : location.hash.substring(1);
            loadView(uri, '#wrapper', function () {
                //default view
                mainViewReady();
                loadCategoryList();
                $('#page-wrapper').show();
            });
        }
    } else {
        loadView('/view/login.html?admin=1', '#wrapper');
    }
});

$(window).on('hashchange', function () {
    var idx = location.hash.indexOf(prefixCallJs);
    console.log("==> hashchange: " + location.hash + " idx:" + idx);
    if (idx >= 0) {
        var jsCode = decodeURIComponent(location.hash.substring(idx + prefixCallJs.length));
        try {
            eval(jsCode);
        } catch (error) {
            console.error(error);
        }
    } else {
        loadView(location.hash, '#wrapper');
    }
});

// ------------ Category Controllers ---------------------

function loadCategoryNavigation() {
    LeoCmsApiUtil.callPostAdminApi(baseAdminApi + '/category/list-all', {}, function (rs) {
        if (rs.data && rs.httpCode === 0) {
            var raw_template = $('#category-navigation-tpl').html();
            var template = Handlebars.compile(raw_template);
            var placeHolder = $('#categoryNavigation');
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


// ------------ User Controllers ---------------------

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

window.currentUserProfile = {'displayName':''};
function loadUserInfoWidget() {
    var urlStr = baseAdminApi + '/user/get-info';
    LeoCmsApiUtil.callPostAdminApi(urlStr, {}, function (json) {
        if (json.httpCode === 0 && json.errorMessage === '') {
            if (json.data) {
                var user = json.data;
                $('#userDisplayName').html(user.displayName);
                window.currentUserProfile = user;
            }
        }
    });
}

// ------------ Report Analytics Controllers ---------------------

function loadMainDashboard() {
    loadView('/view/report/main-dashboard.html?admin=1', pageDomSelector, function () {
        loadDataMainDashboard();
    });
}

function loadContentReport() {
    loadView('/view/report/content-report.html?admin=1', pageDomSelector, function () {

    });
}

function loadLeadReport() {
    loadView('/view/report/lead-report.html?admin=1', pageDomSelector, function () {

    });
}

function loadUserReport() {
    loadView('/view/report/user-report.html?admin=1', pageDomSelector, function () {
        loadDataUserAnalytics();
    });
}

// ------------ Page Controllers ---------------------

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

// ------------ Post Controllers ---------------------

function postEditor(id, pageId, categoryKey) {
    console.log('postEditor' + id);
    loadView('/view/post/post-editor.html?admin=1', pageDomSelector, function () {
        console.log('edit post ' + id);
        loadDataPostEditor({
            'postId': id,
            'pageId': pageId,
            'categoryKey': categoryKey
        });
    });
}

function postInfo(id) {
    if (id) {
        loadView('/view/post/post-info.html?admin=1', pageDomSelector, function () {
            loadDataPostInfo({
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

//////////////////////////////////////////////////// COMMON ////////////////////////////////////////////////

function loadMediaInfoView(mediaInfo, type, editMode) {
    var html = mediaInfo.trim();
    $('#mediaInfoDowdloadUrl').hide();
    if (type === 3) {
        // OFFICE_DOCUMENT
        if (mediaInfo.indexOf('http') != 0) {
            //FIXME
            mediaInfo = window.baseStaticUrl + mediaInfo;
        }
        $('#mediaInfoDowdloadUrl').show().find('a').attr('href', mediaInfo);

        if (mediaInfo.indexOf('.pdf') > 0) {
            html = '<iframe width="100%" height="800" frameborder="0" src="public/js/doc-viewerjs/index.html#' +
                mediaInfo + `"></iframe>`;
        } else if (
            mediaInfo.indexOf('.docx') > 0 || mediaInfo.indexOf('.doc') > 0 || mediaInfo.indexOf('.docm') > 0 ||
            mediaInfo.indexOf('.pptx') > 0 || mediaInfo.indexOf('.ppt') ||
            mediaInfo.indexOf('.xls') || mediaInfo.indexOf('.xlsx') > 0) {
            var url = encodeURIComponent(mediaInfo);
            html = '<iframe width="100%" height="650" frameborder="0" src="https://view.officeapps.live.com/op/embed.aspx?src=' +
                url + '"></iframe>';
        } else if (mediaInfo.indexOf('.png') > 0 || mediaInfo.indexOf('.jpg') > 0) {
            html = '<img src="' + mediaInfo + '" style="max-width:100%;max-height:600px;" />';
        }
    } else if (type === 4) {
        //VIDEO from Google Drive
        if (mediaInfo.indexOf('https://drive.google.com/open') >= 0) {
            var vid = getQueryMapFromUrl(postModel.mediaInfo).id;
            html =
                '<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" frameborder="0" src="https://drive.google.com/file/d/' +
                vid + '/preview"></iframe></div>';
        } else if (mediaInfo.indexOf('https://drive.google.com/file/d/') >= 0) {
            var url = mediaInfo.replace('/view', '/preview');
            html =
                '<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" frameborder="0" src="' +
                url + '"></iframe></div>';
        }
        //VIDEO from uploaded or YouTube
        else if (mediaInfo.indexOf('.mp4') >= 0 ||
            mediaInfo.indexOf('https://youtu.be') >= 0 ||
            mediaInfo.indexOf('https://www.youtube.com') >= 0) {

            var placeHolderId = 'videoPlaceholder' + new Date().getTime();
            html = '<div id="' + placeHolderId + '" class="videoholder" style="width: 100%;"></div>';

            setTimeout(function () {
                var autoplay = true;
                var onReady = function (player) {
                    player.volume(0);
                }
                if (mediaInfo.indexOf('http') != 0) {
                    //FIXME
                    mediaInfo = window.baseStaticUrl + mediaInfo;
                }
                MediaPlayerOne.create(autoplay, placeHolderId, mediaInfo, '', [], 0, 0, onReady);
            }, 400);

            $('#mediaInfoDowdloadUrl').show().find('a').attr('href', mediaInfo);
        }
    }
    if (html === '') {
        html = '<div class="alert alert-info"></div>';
    }
    if (type === 1 && editMode) {
        $('#mediaInfoPreview').hide();
    } else {
        $('#mediaInfoPreview').html(html);
    }
}


function loadCommonModalHtml() {
    var list = [
        '/view/common-widgets/query-filter-modal.html?admin=1',
        '/view/common-widgets/post-type-selection-modal.html?admin=1',
        '/view/common-widgets/confirm-delete-data-modal.html?admin=1',
        '/view/common-widgets/iris-chatbot.html?admin=1'
    ];
    list.forEach(function (e) {
        loadModalboxHtml(e);
    });
}

function getHeadLinesImagsObject() {
    var obj = {};
    $('#headline_images .thumbnail').each(function () {
        var src = $(this).find('img').attr('src');
        var caption = "";
        var node = $(this).find('p.editable');
        if (!node.hasClass('editable-empty')) {
            caption = node.text().trim();
        }
        obj[src] = caption;
    });
    return obj;
}

function initMainSeach() {
    var domSelector = "#main_search";
    var options = {
        url: window.baseAdminApi + "/post/keywords-for-search",
        getValue: "name",
        list: {
            match: {
                enabled: true
            },
            maxNumberOfElements: 10,
            showAnimation: {
                type: "slide",
                time: 200
            },
            hideAnimation: {
                type: "slide",
                time: 200
            },
            sort: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var node = $(domSelector);
                var value = node.getSelectedItemData().name;
                if (value) {
                    node.val(value).trigger("change");
                }
            },
            onChooseEvent: function () {
                searchingByKeywords();
            }
        },
        theme: "round"
    };

    $(domSelector).easyAutocomplete(options).on('keyup', function (e) {
        if (e.keyCode == 13) {
            searchingByKeywords();
            $('.easy-autocomplete-container > ul').hide();
        }
    });
}

function searchContent(keywords) {
    $('#main_search').val(keywords);
    window.currentSearchKeywords = keywords;
    loadView('/view/search-view.html?admin=1', pageDomSelector, function () {
        loadSearchingByKeywords(keywords);
    });
}

window.currentSearchKeywords = window.currentSearchKeywords || '';

function searchingByKeywords() {
    var k = $("#main_search").val();
    if (window.currentSearchKeywords != k) {
        window.currentSearchKeywords = k;
        location.href = '#calljs-searchContent("' + encodeURIComponent(k) + '")';
    }
}

function toggleDiv(aNode, divSelector) {
    var node = $(divSelector);
    if (node.is(":visible")) {
        node.hide();
        var s = $(aNode).html().replace('Hide', 'Show');
        $(aNode).html(s);
    } else {
        node.show();
        var s = $(aNode).html().replace('Show', 'Hide');
        $(aNode).html(s);
    }
}

var loadModalboxHtml = function (uri) {
    $.ajax({
        url: uri,
        type: 'GET',
        success: function (html) {
            $('#common_modalbox_html').append(html);
        },
        error: function (data) {
            console.error("loadModalboxHtml.error: ", data);           
        }
    });
}