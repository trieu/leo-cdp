$(window).load(function() {
	var pub_form = $('#pub_form');
	$("#table-publisher").DataTable({"pageLength": 25});

	//using validatr.js
	pub_form.validatr({
		location: 'left',
		//showall: true
	});
	//custom valid
	pub_form.validatr('addTest', {
		minlength: function (el) {
			var valid = false;
			var min = parseInt($(el).attr('data-minlength'));
			if($(el).val().length >= min){
				valid = true;
			}
			return {
				valid: valid,
				message: 'Text length >= ' + min
			};
		},
		maxlength: function (el) {
			var valid = false;
			var max = parseInt($(el).attr('data-maxlength'));
			if($(el).val().length <= max){
				valid = true;
			}
			return {
				valid: valid,
				message: 'Text length <= ' + max
			};
		}
	});
	//end setup validatr.js

	$('#modal-publisher').on('hide.bs.modal', function (e) {
		$("#pub_container .editing").removeClass("editing");
		$('.row-size-display').hide();
	});

	$('#new-publisher').click(function(){
		$('#modal-publisher').modal('show');
		//empty form
		pub_form.find('input[type="text"], textarea, select').val("");

	});

	$(document).on('click','.edit-publisher', function(){

		var row = $(this).closest('tr');
		var id = row.find('.pub_id').text();
		$('#modal-publisher').modal('show');
		row.addClass('editing');

		$.ajax({
			url: '/publisher/find/'+id,
			type: "GET",
			contentType: "application/json",
			dataType:'json',
			beforeSend: function(){
				$('#modal-publisher .modal-content').append('<div class="loader"></div>');
			},
			success: function(result){
				$('.loader').remove();

				pub_edit_render(result);
			}
		});

	});

	pub_form.submit(function(e) {
		e.preventDefault();
		//check valid form
		if (! $.validatr.validateForm(pub_form)) {
			return false;
		}

		//Array attribute name of input , select , textarea , radio, checkbox
		var nameInput = ['id','name','domain'];
		var data = getFormData(pub_form);

		$.ajax({
			url: '/publisher/save',
			type: "POST",
			contentType: "application/json",
			dataType:'json',
			data: JSON.stringify(data),
			beforeSend: function(){
				$('#wrapper').append('<div class="loader"></div>');
			},
			success: function(result){
				$('.loader').remove();
				var isEdit = $("#pub_container .editing");

				if (isEdit.length > 0) {
					isEdit.replaceWith(pub_print(result));
				}
				else{
					$('#pub_container').append(pub_print(result));
				}

				$('#modal-publisher').modal('hide');
				
				isEdit.removeClass("editing");	
			}
		});
	});

	function pub_edit_render(result) {
		for(var i in result){
			var _this = $('[name="'+i+'"]');

			if(i == '_id'){
				$('[name="id"]').val(result[i]);
			}
			else{
				_this.val(result[i]);
			}
			
		}
	}

	function pub_print(data){
		var html = '\
					<tr> \
						<td class="pub_id">'+data._id+'</td> \
						<td class="pub_name">'+data.name+'</td> \
						<td class="pub_domain">'+ data.domain +'</td> \
						<td width="60px"> \
							<button type="button" id="'+data._id+'" class="btn btn-primary btn-xs edit-publisher"> \
								<i class="fa fa-pencil"></i> \
							</button> \
						</td> \
					</tr> \
				';
		return html;		
	}
});