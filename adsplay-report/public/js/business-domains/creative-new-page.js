$(window).load(function() {
	//validation
	$form = $('#form_creative');	
	$form.on('blur', 'input[required], input.optional, select.required', validator.checkField)
		.on('change', 'select.required', validator.checkField)
		.on('keypress', 'input[required][pattern]', validator.keypress);

	$form.on('change','[name="tgpfs"],[name="prcModel"]', function(){
		if ( checkedIsEmpty( $(this) ) ){
			validator.mark($(this),'must be checked');
		}
		else{
			validator.unmark($(this));
		}
	});

	//set default Running Date
	$('#ads_running_date').val(moment().format('YYYY-MM-DDTHH:mm'));

	//event input keyup youtube
	$("#video_url").keyup(function() {
		var value = $(this).val();
		if(typeof(value) !== 'undefined' && value.indexOf("youtu") != -1){
			var code = checkLinkYoutube(value);
			if (code == "error") {
				modal_alert('Link youtube error !');
				return false;
			}
			var iframe = '<iframe id="youtube_embed" src="https://www.youtube.com/embed/'+code+'?autoplay=true" frameborder="0" allowtransparency="true" allowfullscreen></iframe>';
			$('.iframeVideo').html(iframe);
		}
	});

	//using plugin select
	setTimeout(function(){
		var eleSelect = "#ads_target_location,#paytv_placements,#fshare_placements,#nhacso_placements,#fptplay_categories,#paytv_categories";
		$(eleSelect)
		.multipleSelect({
			filter: true,
			multiple: true,
			width: '100%',
			multipleWidth: '100%',
			selectAllText: 'Select All',
			selectAllDelimiter: ['', ''],
		});

		$('#ads-size').multipleSelect({
			filter: true,
			single: true,
			multiple: false,
			width: '100%',
			onClose: function(view) {
				getPlacementWithSize();
			}
		});

		$('#fptplay_placements')
		.multipleSelect({
			filter: true,
			multiple: true,
			width: '100%',
			multipleWidth: '100%',
			selectAllText: 'Select All',
			selectAllDelimiter: ['', '']
		});

		//get first placement
		getPlacementWithSize();

		//set default

	},200);

});

function getPlacementWithSize(){
	if($('#ads-size').length != 0){
		setTimeout(function(){
			//set edit placements
			if($('#fptplay_placements').length != 0){
				$('#fptplay_placements').multipleSelect('setSelects', creative.tgpms)
			}
			// ajax placement api query with width & height
			var size = $('#ads-size').multipleSelect('getSelects')[0];
			var sizeArr = size.split('x');
			var promise = getDataJson('/placement/api?width='+sizeArr[0]+'&height='+sizeArr[1], 'GET');
			$('#fptplay_placements').empty();
			promise.success(function (data) {
				if(data != null){
					for(var i in data){
						$('#fptplay_placements').append('<option value='+data[i]._id+'>'+data[i].name+'</option>');
					}
				}
				$('#fptplay_placements').multipleSelect('refresh');
			});
		},200);
	}
}

function getSizeAds(){
	var size = $('#ads-size').multipleSelect('getSelects')[0];
	var sizeArr = size.split('x');
	return {w: parseInt(sizeArr[0]), h: parseInt(sizeArr[1])};
}

function checkFormValidator(_this){
	var result = false;
	if(validator.checkAll(_this).valid){
		result = true;
	}
	if (checkedIsEmpty($('[name="tgpfs"]'))) {
		validator.mark($('[name="tgpfs"]'),'must be checked');
		result = false;
	}
	if (checkedIsEmpty($('[name="prcModel"]'))) {
		validator.mark($('[name="prcModel"]'),'must be checked');
		result = false;
	}
	
	return result;
}

function checkedIsEmpty(ele){
	var result = true;
	ele.each(function(){
		if($(this).is(":checked")){
			result = false;
		}
	});
	return result;
}

function checkValueEmpty(_this){
	if(_this.val() == ''){
		return true;
	}
	return false;
}

function checkVideo(){
	if( checkValueEmpty($('#media')) && checkValueEmpty($('#video_file')) && checkValueEmpty($('#video_url')) ){
		errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
		return false;
	}
	else{
		if (!checkValueEmpty($('#video_url'))) {
			var code = checkLinkYoutube($('#video_url').val());
			if (code == "error") {
				errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
				modal_alert('Link youtube error !');
				return false;
			}
		}
		
		return true;
	}
}

function checkImage(){
	if (checkValueEmpty($('#media')) && checkValueEmpty($('#img_file'))) {
		modal_alert('please ! check file image.');
		errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
		return false;
	}
	else{
		if(!checkValueEmpty($('#img_file'))){
			if (!$('#img_file')[0].files[0].name.match(/\.(jpg|jpeg|png|gif)$/)){
				errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
				modal_alert('file image error !');
				scrollTopPage();
				return false;
			}
		}
		return true;
	}
}

function checkZipFile(){
	if (checkValueEmpty($('#media')) && checkValueEmpty($('#zip_file'))) {
		modal_alert('please ! check file.');
		errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
		return false;
	}
	else{
		if(!checkValueEmpty($('#zip_file'))){
			if (!$('#zip_file')[0].files[0].name.match(/\.(zip)$/)){
				errorCss($('#frame_upload'), $('#frame_upload_body .alert'), false);
				modal_alert('zip file error !');
				scrollTopPage();
				return false;
			}
		}
		return true;
	}
}

function errorCss(parent, placement_error, status){
	if(status){
		$('#frame_upload').removeClass('panel-danger').addClass('panel-default');
		$('#frame_upload_body .alert').remove();
	}
	else{
		$('#frame_upload').removeClass('panel-default').addClass('panel-danger');
		$('#frame_upload_body .alert').remove();
		$('#frame_upload_body').append('<div class="alert alert-danger" role="alert">please put something here</div>');
		scrollTopPage();
	}
}

function getDataJson(url, method){
	return $.ajax({
		url: url,
		type: method,
		dataType: 'json'
	});
}

function buildData(_this, media){
	var data = getFormData(_this);

	if(data['vastXml3rd'] === '' ){
		data['is3rdAd'] = false;
	} else {
		data['is3rdAd'] = true;
	}

	// convert fields is array
	var arrayFields = ['tgpfs', 'tgpms', 'tgcats', 'tggds', 'tglocs'];
	for(var i in arrayFields){
		var fields = data[arrayFields[i]];

			if(typeof (fields) == "undefined" || fields == null || fields == ''){
				data[arrayFields[i]] = [];
			}
			else{
				
				if(typeof (data[arrayFields[i]]) == "object"){
					var tempArr = [];
					for(var j in data[arrayFields[i]]){
						var temp = parseInt(data[arrayFields[i]][j]);

						if(arrayFields[i] == 'tglocs'){
							temp = data[arrayFields[i]][j];
						}

						tempArr.push(temp);
					}
					data[arrayFields[i]] = tempArr;
				}
				else{
					var temp = parseInt(fields);

					if(arrayFields[i] == 'tglocs'){
						temp = fields;
					}

					data[arrayFields[i]] = [];
					data[arrayFields[i]].push(temp);
				}
			}
	}
	// convert fields is number
	var numFields = ['cost', 'tBk', 'dBk', 'hBk', 'score', 'prcModel', 'fqcCap', 'status'];
	for(var i in numFields){
		if (isNaN(data[numFields[i]]) || data[numFields[i]] == null || data[numFields[i]] == '') {
			data[numFields[i]] = 0;
		}
		else{
			data[numFields[i]] = parseInt(data[numFields[i]]);
		}
	}

	// size ads
	if($('#ads-size').length != 0){
		var size = getSizeAds();
		data.w = size['w'];
		data.h = size['h'];
	}
	else{
		data.w = 0;
		data.h = 0;
	}

	console.log('---send data---');
	console.log(data);
	// form data
    var fData = new FormData();
    fData.append('creative', JSON.stringify(data));
    fData.append('media', media);

    return fData;
}

function sendForm(url, data, timeout){
	var promise = $.ajax({
		url: url,
		type: "POST",
		data: data,
		contentType: false,
		processData:false,
		timeout: timeout,
		beforeSend: function(){
			var loader = $('<div class="loader"></div>');
			var progress_wrap = $('<div class="progress"></div>');
			var progress = $('<div class="progress-bar progress-bar-success progress-bar-striped" style="width:0%"></div> </div>');

			$('#wrapper').append(loader);
			loader.append(progress_wrap);
			progress_wrap.append(progress)
			var number = 0;
			var countUp = setInterval(function(){
				var temp = getRandomInt(1, 10);
				number += temp;
				progress.width(number+'%');
				progress.text(number);
				if (number > 90){
					return clearInterval(countUp);
				}

			}, 1000);
		},
		success: function(data){
			$(".loader").remove();
			window.location = location.protocol+'//'+location.host+'/creative/'+data;
		}
	});

	promise.fail(function(jqXHR, textStatus) {
		console.log("@@report:  " + textStatus);
		if( textStatus == "timeout" || textStatus == "error") {
			$(".loader").remove();
			window.location = location.protocol+'//'+location.host+'/creative/list/all';
		}
	});
}