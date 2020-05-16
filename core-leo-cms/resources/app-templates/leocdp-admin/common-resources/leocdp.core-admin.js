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
                }, 654);
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
            }, 360);

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