$(window).load(function() {
	var plt_form = $('#plt_form');

	//using validatr.js
	plt_form.validatr({
		location: 'left',
		//showall: true
	});
	//custom valid
	plt_form.validatr('addTest', {
		minLength: function (el) {
			var valid = false;
			var min = parseInt($(el).attr('data-minLength'));
			if($(el).val().length >= min){
				valid = true;
			}
			return {
				valid: valid,
				message: 'Length >= ' + min
			};
		},
		maxLength: function (el) {
			var valid = false;
			var max = parseInt($(el).attr('data-maxLength'));
			if($(el).val().length <= max){
				valid = true;
			}
			return {
				valid: valid,
				message: 'Length <= ' + max
			};
		}
	});
	//end setup validatr.js

	$('#modal-placement').on('hide.bs.modal', function (e) {
		$("#plt_container .editing").removeClass("editing");
	});

	$('#new-placement').click(function(){
		$('#modal-placement').modal('show');
		plt_form.find('input').val("");
	});

	$(document).on('click','.edit-placement', function(){
		var row = $(this).closest('tr');
		$('#modal-placement').modal('show');

		row.addClass('editing');
		plt_form.find('input').each(function(i) {
			var attr = $(this).attr('name');
			var getValue = row.find('.'+attr).text();
			$(this).val(getValue);
		});
	});

	plt_form.submit(function(e) {
		e.preventDefault();
		//check valid form
		if (! $.validatr.validateForm(plt_form)) {
			return false;
		}

		var data = plt_data(plt_form);

		$.ajax({
			url: '/placement/save/',
			type: "POST",
			contentType: "application/json",
			dataType:'json',
			data: JSON.stringify(data),
			beforeSend: function(){
				$('#wrapper').append('<div class="loader"></div>');
			},
			success: function(result){
				$('.loader').remove();
				var isEdit = $("#plt_container .editing");

				if (isEdit.length > 0) {
					isEdit.replaceWith(plt_print(result));
				}
				else{
					$('#plt_container').append(plt_print(result));
				}

				$('#modal-placement').modal('hide');
				
				isEdit.removeClass("editing");	
			}
		});
	});

	function plt_data(form){
		var data = {};
			data.id = form.find('[name="plt_id"]').val();
			data.name = form.find('[name="plt_name"]').val();
			data.publisher = form.find('[name="plt_publisher"]').val();
			data.type = form.find('[name="plt_type"]').val();
			data.width = form.find('[name="plt_width"]').val();
			data.height = form.find('[name="plt_height"]').val();
			data.updatedDate = form.find('[name="plt_updatedDate"]').val();
		return data;	
	}

	function plt_print(data){
		var html = '\
					<tr> \
						<td class="plt_id">'+data.id+'</td> \
						<td class="plt_name">'+data.name+'</td> \
						<td class="plt_publisher">'+data.publisher+'</td> \
						<td class="plt_type">'+data.type+'</td> \
						<td class="plt_width">'+data.width+'</td> \
						<td class="plt_height">'+data.height+'</td> \
						<td class="plt_updatedDate">'+data.updatedDate+'</td> \
						<td width="40px"> \
							<button type="button" id="'+data.id+'" class="btn btn-primary btn-xs edit-placement"> \
								<i class="fa fa-pencil"></i> \
							</button> \
						</td> \
					</tr> \
				';
		return html;		
	}
});