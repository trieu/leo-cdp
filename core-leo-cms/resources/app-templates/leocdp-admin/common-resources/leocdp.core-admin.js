/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functions for admin
 * TODO need to refactoring code
 * 
 */

var prefixCallJs = '#calljs-';
var pageDomSelector = '#page_main_content';

$(document).ready(function () {
    if (LeoAdminApiUtil.isLoginSessionOK()) {
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
            html = '<iframe width="100%" height="800" frameborder="0" src="public/js/doc-viewerjs/index.html#' + mediaInfo + `"></iframe>`;
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
            html = '<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" frameborder="0" src="https://drive.google.com/file/d/' +
                vid + '/preview"></iframe></div>';
        } else if (mediaInfo.indexOf('https://drive.google.com/file/d/') >= 0) {
            var url = mediaInfo.replace('/view', '/preview');
            html =
                '<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" frameborder="0" src="' + url + '"></iframe></div>';
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

function initMainSeach() {
	
    var domSelector = "#main_search";
    var usersession = lscache.get('usersession');
    var optionsAutocomplete = {
        url: window.baseAdminApi + "/cdp/profiles/search-suggestion",
        ajaxSettings: {
        	beforeSend: function (xhr) {
				xhr.setRequestHeader('leouss', usersession);
			}
        },
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

    $(domSelector).easyAutocomplete(optionsAutocomplete).on('keyup', function (e) {
        if (e.keyCode == 13) {
            searchingByKeywords();
            $('.easy-autocomplete-container > ul').hide();
        }
    });
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

var getIconItemByKey = function(key){
	var icon = '';
	if(key === 'twitter'){
		icon = 'Twitter <i class="fa fa-twitter-square" aria-hidden="true"></i> ';
	}
	else if(key === 'linkedin'){
		icon = 'LinkedIn <i class="fa fa-linkedin-square" aria-hidden="true"></i> ';
	}
	else if(key === 'facebook'){
		icon = 'Facebook <i class="fa fa-facebook-square" aria-hidden="true"></i> ';
	}
	else if(key === 'instagram'){
		icon = 'Instagram <i class="fa fa-instagram" aria-hidden="true"></i> ';
	}
	else if(key === 'skype'){
		icon = 'Skype <i class="fa fa-skype" aria-hidden="true"></i> ';
	}
	else if(key === 'github'){
		icon = 'Github <i class="fa fa-github" aria-hidden="true"></i> ';
	}
	return icon;
}

var initDateFilterComponent = function(withTime, beginDateTime, endDateTime){
	var formatDateTime = withTime === true ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
	
	var end = new moment().format(formatDateTime);
	var begin = new moment().subtract(365, 'days').format(formatDateTime);
	
	if(beginDateTime != null){
		$('#beginFilterDate').datetimepicker({
	        useCurrent: false, 
	        format: formatDateTime,
	        defaultDate: new moment(beginDateTime).format(formatDateTime)
	    });
	} else {
		$('#beginFilterDate').datetimepicker({
		    format: formatDateTime,
		    defaultDate: begin
		});
	}
	
	if(endDateTime != null){
		$('#endFilterDate').datetimepicker({
	        useCurrent: false, 
	        format: formatDateTime,
	        defaultDate: new moment(endDateTime).format(formatDateTime)
	    });
	} else {
		$('#endFilterDate').datetimepicker({
	        useCurrent: false, 
	        format: formatDateTime,
	        defaultDate: end
	    });
	}
    
}

var getDateFilterValues = function(){
	var bDate = $('#beginFilterDate').data("DateTimePicker").date().format();
	var eDate = $('#endFilterDate').data("DateTimePicker").date().format();
	return { beginFilterDate : bDate, endFilterDate : eDate }
}

// for file uploader in trix editor
document.addEventListener("trix-file-accept", function(event) {
  event.preventDefault();
});

// Page Router ##################################################################################


function leoCdpRouter(objKey,objId){
	var obj = LeoCdpAdmin.navRouters[objKey];
	console.log( obj );
	
	$('#main-navbar').find('a.active').removeClass('active');
	
	// generate breadcrumb navigation
	var breadcrumbHtml = '';
	var titleNav = '';
	var breadcrumbList = obj.breadcrumb;
	var len = breadcrumbList.length;
	var activeMenuItemId = '';
	for(var i=0; i< len; i++ ){
		var name = breadcrumbList[i];
		titleNav  = titleNav + name + " - ";
		var key = name.replace(/ /g, "_");
		var jsFunc = LeoCdpAdmin.navRouters[key] ? "leoCdpRouter('"+ key + "')"  : '';
		
		if( i < (len - 1) ){
			breadcrumbHtml = breadcrumbHtml + '<a id="tnv_'+key+'" title="'+ name +'" href="#calljs-' + jsFunc + '"> ' + breadcrumbList[i] + ' </a> ';
			breadcrumbHtml = breadcrumbHtml + ' &#8594; ';
		} else {
			breadcrumbHtml = breadcrumbHtml + '<a id="tnv_'+key+'" title="'+ name +'" href="javascript:"> ' + breadcrumbList[i] + ' </a> ';
		}
		
		activeMenuItemId = LeoCdpAdmin.navRouters[key] ? (LeoCdpAdmin.navRouters[key].activeMenuItem || activeMenuItemId)  : activeMenuItemId;
		console.log('activeMenuItemId ' + activeMenuItemId)
	}
	if(activeMenuItemId != ''){
		$('#main-navbar').find('#'+activeMenuItemId).addClass('active');
	}
	
	
	var vf = LeoCdpAdmin.navFunctions[obj.functionName];
	
	if(typeof vf === 'function') {
		// init context for view router
		LeoCdpAdmin.routerContext = {};
		
		if(objId)
		{
			console.log(objKey + " objId " + objId)
			LeoCdpAdmin.routerContext.objId = objId;
			vf.apply(null,[objId,breadcrumbHtml]);
		} 
		else 
		{
			console.log(objKey + " ")
			LeoCdpAdmin.routerContext.objId = false;
			vf.apply(null,[breadcrumbHtml]);
		}
		document.title = titleNav;
	} else {
		console.error( " LeoCdpAdmin.navFunctions[obj.functionName] is not a function " );
		console.error( obj );
	}
	console.log( objId );
}

function gotoLeoCdpRouter(){
	var paramStr = '';
	for(var i=0; i < arguments.length; i++){
		paramStr = paramStr +  "'" +  arguments[i];
		if( i+1 < arguments.length ){
			paramStr +=  "'," ;
		} else {
			paramStr +=  "'" ;
		}
	}
	var hash = 'calljs-leoCdpRouter(' + paramStr  + ")";
	location.hash = hash;
}

LeoCdpAdmin.loadDataAndUpdateView = function(urlStr, params, dataProcessor, callback) {
	var url = baseAdminApi + urlStr;
	LeoAdminApiUtil.callPostAdminApi(url, params, function (json) {
        if (json.httpCode === 0 && json.errorMessage === '') {
        	var canInsertData = json.canInsertData;
	    	var canEditData = json.canEditData;
    		var canDeleteData = json.canDeleteData;
    		
    		if( ! canEditData ){
				$('button.data-control-edit').attr('disabled','disabled');
			}
    		if( ! canDeleteData ){
				$('button.data-control-delete').attr('disabled','disabled');
			}
    		if( ! canInsertData ){
				$('button.data-control-insert').attr('disabled','disabled');
			}
    		
        	LeoCdpAdmin.routerContext.dataObject = typeof dataProcessor === 'function' ? dataProcessor(json.data) : json.data;
        	
        	$('#page_data_holder').find('*[data-field]').each(function(){
        		var fieldholder = $(this).data('fieldholder');
        		var fieldtype = $(this).data('fieldtype'); 
        		
        		var field = $(this).data('field');
        		var toks = field.split('.');
        		if(toks.length === 1){
        			var value = LeoCdpAdmin.routerContext.dataObject[toks[0]];
        			
        			if(fieldholder === 'html'){
        				if(fieldtype === 'int' || fieldtype === 'float' ) {
        					if( value === undefined || value == null ){
                				value = "No data";
                			} else {
                				value = new Number(value).toLocaleString();
                				if(value == NaN || value == 'NaN'){
                					value = "No data";
                				}
                			}
            			}
        				else if(fieldtype === 'date'){
        					value = moment.utc(value).local().format('YYYY-MM-DD HH:mm:ss');
        				}
        				$(this).html(value)
        			}
        			else if(fieldholder === 'url'){
        				$(this).html($('<a/>').attr('href',value).attr('target','_blank').html(value));
        			}
        			else if(fieldholder === 'locationcode'){
        				var aNode = $('<a/>').attr('href','javascript:').html(value).click(function(){
        					var url = 'https://plus.codes/'+ LeoCdpAdmin.routerContext.dataObject.locationCode;
        					eModal.iframe(url, value)
        				})
        				$(this).html(aNode);
        			}
        			
        			else if(fieldholder === 'inputvalue'){
        				$(this).val(value)
        			}
        			else if(fieldholder === 'html_hashmap'){
        				var ulHtml = '<ul class="list-group" >';
        				_.forOwn(value,function(value, key) {
        					var icon = '';
        					ulHtml = ulHtml + '<li class="list-group-item" > ' + getIconItemByKey(key) + value + '</li>';
              			});
        				
        				ulHtml += '</ul>';
        				$(this).html(ulHtml)
        			}
        			else if(fieldholder === 'html_hashset'){
        				var ulHtml = '<ul class="list-group" >';
        				_.forOwn(value,function(value, key) {
        					var icon = '';
        					ulHtml = ulHtml + '<li class="list-group-item" ><i class="fa fa-check" aria-hidden="true"></i> ' + value + '</li>';
              			});
        				
        				ulHtml += '</ul>';
        				$(this).html(ulHtml)
        			}
        			else if(fieldholder === 'html_list_key_value'){
        				var ulHtml = '<ul class="list-group" >';
        				_.forOwn(value,function(value, key) {
        					var icon = '';
        					ulHtml = ulHtml + '<li class="list-group-item" > ' + key + ' <i class="fa fa-arrow-right" aria-hidden="true"></i> ' + value + '</li>';
              			});
        				
        				ulHtml += '</ul>';
        				$(this).html(ulHtml)
        			}
        		} 
        		else if(toks.length === 2){
        			var value = LeoCdpAdmin.routerContext.dataObject[toks[0]][toks[1]];
        			if(fieldholder === 'html'){
        				$(this).html(value)
        			}
        			else if(fieldholder === 'inputvalue'){
        				$(this).val(value)
        			}
        			else if(fieldholder === 'url'){
        				$(this).html($('<a/>').attr('href',value).attr('target','_blank').html(value));
        			}
        		}
        	}).promise().done( function() {
    			if(typeof callback === 'function') callback();
    	    });
        	
        } else {
            LeoAdminApiUtil.logErrorPayload(json);
        }
    });
}

LeoCdpAdmin.updateDataObjectOfView = function(urlStr, params, callback) {
	$('#page_data_holder').find('*[data-field]').each(function(){
     	var field = $(this).data('field'); 
     	var fieldholder = $(this).data('fieldholder'); 
     	var fieldtype = $(this).data('fieldtype'); 
     	var value = '';
        if(fieldholder === 'html'){
             value = $(this).html().trim(); 
        } else if(fieldholder === 'inputvalue'){
             value = $(this).val();
        }
        if(fieldtype === 'int') {
        	value = parseInt(value.replace(/,/g,''))
        }
        else if(fieldtype === 'float') {
        	value = parseFloat(value.replace(/,/g,''))
        }
        else if(fieldtype === 'date') {
        	value = new Date(value);
        }
        
        var toks = field.split('.');
 		if(toks.length === 1){
 			LeoCdpAdmin.routerContext.dataObject[toks[0]] = value;
 		}
 		else if(toks.length === 2){
 			LeoCdpAdmin.routerContext.dataObject[toks[0]][toks[1]] = value;
 		}
	}).promise().done(function() {   
        LeoAdminApiUtil.callPostAdminApi(urlStr, params, function (json) {
             if (json.httpCode === 0 && json.errorMessage === '') {
     			if(typeof callback === 'function') callback(json);
             } else {
                 LeoAdminApiUtil.logErrorPayload(json);
             }
        });
    });
}

var jsGridItemUrlTemplate = function(value) {
    return $("<a>").attr('target','_blank').attr('title',value).attr("href", value).text(value);
}

var getOperatorsForStringField = function(){
	var operators = ["equal", "not_equal", "is_null", "is_not_null","begins_with","not_begins_with","contains","not_contains","ends_with","not_ends_with","is_empty","is_not_empty"];
	return operators;
}

var getOperatorsForNumberField = function(){
	var operators = ["equal", "not_equal","less","less_or_equal","greater","greater_or_equal","between","not_between" ];
	return operators;
}

function roundNumber(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function getCheckedBoxIcon(data){
	var html = '<i style="font-size:1.4em;color:#3300ff" class="fa fa-check-square-o" aria-hidden="true"></i>';
	if( ! data ){
		html = '<i style="font-size:1.4em;color:#3300ff" class="fa fa-square-o" aria-hidden="true"></i>';
	}
	return html;
}
