function render_vast() {
	var form = '<form id="vast_form" action="/vast/save" method="POST">\
						<input type="hidden" class="form-control" name="vast-id">\
						<div class="form-group">\
							<label>Name</label>\
							<input type="text" class="form-control" name="vast-name" placeholder="Enter name">\
						</div>\
						<div class="form-group" id="impression-group">\
							<label>Impression <a href="#" class="btn-plus" id="plus-impression"><i class="fa fa-plus-square" aria-hidden="true"></i></a></label>\
							<input type="text" class="form-control" name="vast-impression" placeholder="Enter impression">\
						</div>\
						<div class="form-group" id="trackingevents-group">\
							<label>Tracking Events <a href="#" class="btn-plus" id="plus-tracking"><i class="fa fa-plus-square" aria-hidden="true"></i></a></label>\
							<div class="form-group-inner">\
								<select name="TrackingEvents-name" class="form-control" placeholder="Enter tracking name event">\
									<option value="creativeView">creativeView</option>\
									<option value="start">start</option>\
									<option value="firstQuartile">firstQuartile</option>\
									<option value="thirdQuartile">thirdQuartile</option>\
									<option value="complete">complete</option>\
									<option value="pause">pause</option>\
									<option value="mute">mute</option>\
									<option value="fullscreen">fullscreen</option>\
								</select>\
								<input type="text" class="form-control" name="TrackingEvents-value" placeholder="Enter tracking value">\
							</div>\
						</div>\
						<div class="text-right">\
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
							<button type="submit" class="btn btn-primary" id="vast_submit">\
								OK\
							</button>\
						</div>\
					</form>';

	var modal = '<div id="modal-vast" class="modal fade" tabindex="-1" role="dialog">\
		<div class="modal-dialog" role="document">\
			<div class="modal-content">\
				<div class="modal-header">\
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
					<h4 class="modal-title">Form Vast</h4>\
				</div>\
				<div class="modal-body"></div>\
			</div>\
		</div>\
	</div>';

	$('body').append(modal);
	$('#modal-vast .modal-body').append(form);
	$('#tracking-placement label').append('<a href="#" id="modal-vast-btn"><i class="fa fa-plus-square" aria-hidden="true"></i></a>')
}

function vastGetById(id){
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
}

function runVast(){
	if(typeof (creativeData) != 'undefined' && $('#ads_target_location').length != 0){
		render_vast();
		$('[name="vast-id"]').val(creativeData.id);
		$('[name="vast-name"]').val(creativeData.id+'-ad');
	}

	$(document).on('click','#modal-vast-btn', function(e){
		e.preventDefault();
		$('#modal-vast').modal('show');
		vastGetById($('[name="vast-id"]').val());
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

	$('#vast_form').submit(function(e){
		e.preventDefault();
		var form = $(this).serializeArray();

		//get data
		var data = {};
		data._id = parseInt($('[name="vast-id"]').val()); 
		data.Name = $('[name="vast-name"]').val();
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

		//save
		$.ajax({
			url: '/vast/save',
			type: "POST",
			contentType: "application/json",
			dataType:'json',
			data: JSON.stringify(data),
			success: function(data){
				console.log("success !!!");
				$("#modal-vast .modal-body .alert").remove();
				$('[name="vastXml3rd"]').val(data.url);
				$('#modal-vast').modal('hide');
			},
			error: function(){
				$("#modal-vast .modal-body").append('<div class="alert alert-danger">Error!!!</div>');
			}
		});

	});
}

runVast();
