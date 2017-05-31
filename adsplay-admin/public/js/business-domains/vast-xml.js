var VAST = function() {};

VAST.prototype = function() {

	var linkFileVast = window.location.protocol +"//"+ window.location.hostname + "/vast/file/";

	function alert_popup(el, message, type, timeout){
		var relay = timeout || 5000;
		var alert = $('<div class="alert alert-'+type+'" role="alert">'+message+'</div>');
		el.append(alert);
		setTimeout(function(){
			el.find('.alert').fadeOut(500).queue(function() {
				$(this).remove();
			});
		}, relay);
	}

	function checkEmpty(_this){
		if(_this.val() == ''){
			return true;
		}
		return false;
	}

	function checkXmlFile(_this){
		if (!_this.name.match(/\.(xml)$/)){
				return false;
		}
		return true;
	}

	var render = function() {
		var tab = '<div id="vast_tab">\
			<ul class="nav nav-tabs" role="tablist">\
				<li class="active"><a href="#tab_vast_form" role="tab" data-toggle="tab">VAST Builder</a></li>\
				<li><a href="#tab_vast_url" role="tab" data-toggle="tab">VAST URL</a></li>\
				<li><a href="#tab_vast_upload" role="tab" data-toggle="tab">VAST Upload File</a></li>\
			</ul>\
			<div class="tab-content">\
				<div role="tabpanel" class="tab-pane active" id="tab_vast_form"></div>\
				<div role="tabpanel" class="tab-pane" id="tab_vast_url"></div>\
				<div role="tabpanel" class="tab-pane" id="tab_vast_upload"></div>\
			</div>\
		</div>';
		var url = '<form id="vast_url" action="/vast/url" method="POST">\
			<div class="form-group" id="upload_xml">\
				<label>URL</label>\
				<input type="text" class="form-control" name="vast-url" placeholder="Enter Url">\
			</div>\
			<div class="text-right">\
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
				<button type="submit" class="btn btn-primary">OK</button>\
			</div>\
		</form>';
		var upload = '<form id="vast_upload" action="/vast/upload" method="POST" enctype="multipart/form-data">\
			<div class="form-group" id="upload_xml">\
				<label>Upload File VAST XML</label>\
				<input type="file" id="vast_file">\
			</div>\
			<div class="text-right">\
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
				<button type="submit" class="btn btn-primary">OK</button>\
			</div>\
		</form>';
		var form = '<form id="vast_form" action="/vast/save" method="POST">\
			<div class="form-group" id="impression-group">\
				<label>Impression <a href="#" class="btn-plus" id="plus-impression"><i class="fa fa-plus-square" aria-hidden="true"></i></a></label>\
				<input type="text" class="form-control" name="vast-impression" placeholder="Enter impression">\
			</div>\
			<div class="form-group" id="trackingevents-group">\
				<label>Tracking Events <a href="#" class="btn-plus" id="plus-tracking"><i class="fa fa-plus-square" aria-hidden="true"></i></a></label>\
				<div class="form-group-inner">\
					<select name="TrackingEvents-name" class="form-control" placeholder="Enter tracking name event">\
					<option value="acceptInvitation">acceptInvitation</option>\
					<option value="close">close</option>\
					<option value="collapse">collapse</option>\
					<option value="complete">complete</option>\
					<option value="creativeView">creativeView</option>\
					<option value="expand">expand</option>\
					<option value="firstQuartile">firstQuartile</option>\
					<option value="fullscreen">fullscreen</option>\
					<option value="midpoint">midpoint</option>\
					<option value="mute">mute</option>\
					<option value="pause">pause</option>\
					<option value="resume">resume</option>\
					<option value="rewind">rewind</option>\
					<option value="start">start</option>\
					<option value="thirdQuartile">thirdQuartile</option>\
					<option value="unmute">unmute</option>\
					</select>\
				<input type="text" class="form-control" name="TrackingEvents-value" placeholder="Enter tracking value">\
				</div>\
			</div>\
			<div class="text-right">\
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
				<button type="submit" class="btn btn-primary">OK</button>\
			</div>\
		</form>';

		var modal = '<div id="modal-vast" class="modal fade" tabindex="-1" role="dialog">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-body"></div>\
							</div>\
						</div>\
					</div>';

		$('body').append(modal);
		$('#modal-vast .modal-body').append(tab);
		$('#vast_tab #tab_vast_form').append(form);
		$('#vast_tab #tab_vast_upload').append(upload);
		$('#vast_tab #tab_vast_url').append(url);
		$('#tracking-placement label').append('<a href="#" id="modal-vast-btn"><i class="fa fa-plus-square" aria-hidden="true"></i></a>')

	};

	var getById = function(id) {
		$.ajax({
			url: '/vast/find/'+id,
			type: "GET",
			contentType: "application/json",
			dataType:'json',
			success: function(data){
				var cImp = data.Impression.length;
				if(cImp > 0){

					for (var i = 0; i < cImp; i++) {
						if ($('[name=vast-impression]').length < cImp) {
							var copy = $('#impression-group').find('[name=vast-impression]:first').clone();
							$('#impression-group').append(copy);
						}
					};

					for (var j = 0; j < cImp; j++) {
						$('[name=vast-impression]').eq(j).val(data.Impression[j]);
					};

				}

				var cTra = data.TrackingEvents.length;
				if(cTra > 0){

					for (var i = 0; i < cTra; i++) {
						if ($('.form-group-inner').length < cTra) {
							var copy = $('#trackingevents-group').find('.form-group-inner:first').clone();
							$('#trackingevents-group').append(copy);
						}
					};

					for (var j = 0; j < cTra; j++) {
						$('.form-group-inner').eq(j).find('[name=TrackingEvents-name]').val(data.TrackingEvents[j].name);
						$('.form-group-inner').eq(j).find('[name=TrackingEvents-value]').val(data.TrackingEvents[j].value);
					};

				}
			}
		});
	};

	var init = function(){
		var getNameFile = function(){
			var vastName;
			var vastXml = $('[name="vastXml3rd"]').val();
			if (vastXml == "") {
				vastName = new Date().getTime() + $('#form_creative [name="name"]').val();
			}
			else{
				var vastXmlSplit = vastXml.split('/');
				vastName = vastXmlSplit[vastXmlSplit.length-1];
			}
			return vastName;
		};

		if($('#ads_target_location').length != 0){
			render();
		}

		$(document).on('click','#modal-vast-btn', function(e){
			e.preventDefault();
			$('#modal-vast').modal('show');
		});

		$(document).on('click','#plus-impression', function(e){
			e.preventDefault();
			var pa = $(this).parents('.form-group')
			var copy = pa.find('[name=vast-impression]:first').clone();
			pa.append(copy);
		});

		$(document).on('click','#plus-tracking', function(e){
			e.preventDefault();
			var pa = $(this).parents('.form-group')
			var copy = pa.find('.form-group-inner:first').clone();
			pa.append(copy);
		});

		$('#vast_upload').submit(function(e){
			e.preventDefault();

			if(!checkEmpty($('#vast_file'))){

				if (checkXmlFile($('#vast_file')[0].files[0])) {
					var formData = new FormData();
					formData.append('files', $(this).find('#vast_file')[0].files[0]);
					formData.append('temp', $('[name="vastXml3rd"]').val());

					$.ajax({
						url : '/vast/save/upload',
						type : 'POST',
						data : formData,
						processData: false,
						contentType: false,
						success : function(data) {
							if (!data.message) {
								alert_popup($('#vast_upload'), "error", "danger");
							}
							else{
								alert_popup($('#vast_upload'), data.message, "success", 2000);
								$('[name="vastXml3rd"]').val(linkFileVast+data.filename);
								$('#modal-vast').modal('hide');
							}
						}
					});
				}
				else{
					alert_popup($('#vast_upload'), "Incorrect VAST file", "danger", 2000);
				}
			}
			else{
				alert_popup($('#vast_upload'), "File is empty", "danger", 2000);
			}
			
		});

		$('#vast_url').submit(function(e){
			e.preventDefault();

			var data = {};
			data.url = $('[name=vast-url]').val();
			data.temp = $('[name="vastXml3rd"]').val();

			$.ajax({
				url : '/vast/save/url',
				type : 'POST',
				contentType: "application/json",
				dataType:'json',
				data: JSON.stringify(data),
				success : function(data) {
					if (!data.message) {
						alert_popup($('#vast_url'), "error !!! check url", "danger");
					}
					else{
						alert_popup($('#vast_url'), data.message, "success", 2000);
						$('[name="vastXml3rd"]').val(linkFileVast+data.filename);
						$('#modal-vast').modal('hide');
					}
				}
			});
		});

		$('#vast_form').submit(function(e){
			e.preventDefault();
			var form = $(this).serializeArray();

			var data = {};
			data.Name = getNameFile();
			data.Impression = [];
			$('[name="vast-impression"]').each(function(){
				data.Impression.push($(this).val());
			});
			data.TrackingEvents = [];
			$('.form-group-inner').each(function(){
				var name = $(this).find('[name="TrackingEvents-name"]').val();
				var value = $(this).find('[name="TrackingEvents-value"]').val();
				data.TrackingEvents.push({name: name, value});
			});
			data.temp = $('[name="vastXml3rd"]').val();

			$.ajax({
				url: '/vast/save',
				type: "POST",
				contentType: "application/json",
				dataType:'json',
				data: JSON.stringify(data),
				success: function(data){
					// $("#modal-vast .modal-body .alert").remove();
					
					if (!data.message) {
						alert_popup($('#vast_form'), "error", "danger");
					}
					else{
						alert_popup($('#vast_form'), data.message, "success", 2000);
						$('[name="vastXml3rd"]').val(linkFileVast+data.filename);
						$('#modal-vast').modal('hide');
					}
					
				},
				error: function(){
					$("#modal-vast .modal-body").append('<div class="alert alert-danger">Error!!!</div>');
				}
			});

		});
	};

	return {
		init: init,
		getById: getById
	}

}();

var VAST = new VAST().init();