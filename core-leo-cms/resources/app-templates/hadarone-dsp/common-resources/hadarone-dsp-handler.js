var prefixCallJs = '#calljs-';
var pageDomSelector = '#page-wrapper';
window.apiCacheEnabled = false;

$(document).ready(function () {
    if (LeoCmsApiUtil.isLoginSessionOK()) {
        var defaultPath = '/view/navigation-view.html';

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
                        location.href = '/';
                    }
                }, 600);
            });
        } else {
            var uri = location.hash.length === 0 ? defaultPath : location.hash.substring(1);
            loadView(uri, '#wrapper', function () {
                //default view
                mainViewReady();
                loadMainDashboard();
                $('#page-wrapper').show();
            });
        }
    } else {
        loadView('/view/login.html', '#wrapper');
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



function loadMainDashboard() {
    loadView('/view/report/main-dashboard.html', pageDomSelector, function () {
        loadDataCategoryList();
    });
}



// ------------ User Controllers ---------------------



function loadUserInfoWidget() {
    var urlStr = baseAdminApi + '/user/get-info';
    LeoCmsApiUtil.callPostAdminApi(urlStr, {}, function (json) {
        if (json.httpCode === 0 && json.errorMessage === '') {
            if (json.data) {
                var user = json.data;
                $('#userDisplayName').html(user.displayName);
            }
        }
    });
}

// ------------ Report Analytics Controllers ---------------------

function loadMainDashboard() {
    loadView('/view/report/main-dashboard.html', pageDomSelector, function () {
        loadDataMainDashboard();
    });
}

function loadCampaigns() {
    loadView('/view/report/campaigns.html', pageDomSelector, function () {
        loadDataCampaigns();
    });
}


function campaignReportDetails(id) {
    if (id) {
        loadView('/view/report/campaigns.html', pageDomSelector, function () {
            loadDataCampaignReportDetails({
                postId: id
            });
        });
    }
}

function loadContentReport() {
    loadView('/view/report/content-report.html', pageDomSelector, function () {

    });
}

function loadLeadReport() {
    loadView('/view/report/lead-report.html', pageDomSelector, function () {

    });
}



//////////////////////// COMMON /////////////////////////////


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
    loadView('/view/search-view.html', pageDomSelector, function () {
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