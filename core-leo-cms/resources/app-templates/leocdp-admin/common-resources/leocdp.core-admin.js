var prefixCallJs = '#calljs-';
var pageDomSelector = '#page_main_content';

$(document).ready(function () {
    if (LeoCmsApiUtil.isLoginSessionOK()) {
        var defaultPath = '/view/main-view.html?admin=1';

        //find action js
        var idx = location.hash.indexOf(prefixCallJs);
        if (idx >= 0) {
            LeoCdpAdmin.loadView(defaultPath, '#wrapper', function () {
                mainViewReady();
                setTimeout(function () {
                    try {
                        var jsCode = decodeURIComponent(location.hash.substring(idx + prefixCallJs.length).trim());
                        if (jsCode != '') {
                            eval(jsCode);
                        }
                        $(pageDomSelector).show();
                    } catch (error) {
                        alert(error);
                        location.href = '/admin';
                    }
                }, 654);
            }, true);
        } else {
            var uri = location.hash.length === 0 ? defaultPath : location.hash.substring(1);
            LeoCdpAdmin.loadView(uri, '#wrapper', function () {
                //default view
                mainViewReady();
                
                setTimeout(function(){
                	leoCdpRouter('defaultRouter')
                },1200)  
                
                $(pageDomSelector).show();
                
            }, true);
        }
    } else {
        LeoCdpAdmin.loadView('/view/login.html?admin=1', '#wrapper');
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
        LeoCdpAdmin.loadView(location.hash, '#wrapper');
    }
});


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
    if ( (type === 1 || type === 9) && editMode) {
        $('#mediaInfoPreview').hide();
    } else {
        $('#mediaInfoPreview').html(html);
    }
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

function searchContent(keywords) {
    $('#main_search').val(keywords);
    window.currentSearchKeywords = keywords;
    LeoCdpAdmin.loadView('/view/search-view.html?admin=1', pageDomSelector, function () {
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

var setupTabPanels = function(){
	$('ul[class="nav nav-tabs"]').each(function(){
		var ulNode = $(this);
		var targetTabsId = $(this).data('tab-content');
		
		ulNode.find('a').click(function(){ 
			//clear active element
			ulNode.find('li').removeClass('active'); 
	        $('#'+targetTabsId).find('div[class*="tab-pane"]').removeClass('active');
	        
	        //set active element    
	        $(this).parent().addClass('active');
	        var targetTab = $(this).data('target-tab');
	        $('#'+targetTab).addClass('active');
		})
	});
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

var makeNodeEditable = function(selector){
    selector.attr('title','Editor').editable({
        type: 'textarea',
        rows: 3,
        inputclass: 'editable_text_editor'
    })
}

var initDateFilterComponent = function(){
	var end = new moment().format("YYYY-MM-DD");
	var begin = new moment().subtract(120, 'days').format("YYYY-MM-DD");
	
	$('#beginFilterDate').datetimepicker({
	    format: 'YYYY-MM-DD',
	        defaultDate: begin
	});
    $('#endFilterDate').datetimepicker({
        useCurrent: false, 
        format: 'YYYY-MM-DD',
        defaultDate: end
    });
}


document.addEventListener("trix-file-accept", function(event) {
  event.preventDefault();
});