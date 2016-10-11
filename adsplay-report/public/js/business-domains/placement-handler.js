$(window).load(function() {
	var plt_form = $('#plt_form');

	var type = {1: "video", 2: "Display Banner", 3: "Overlay Banner"};

	setTimeout(function(){
		$.ajax({
			url: '/publisher/getAll',
			type: "GET",
			contentType: "application/json",
			dataType:'json',
			success: function(result){
				$("#ads-publisher").empty();
				$.each(result, function (i, item) {
					$("#ads-publisher").append('<option value="'+item._id+'">'+item.name+'</option>');
				});
			}
		});
	},100);

	function select_render(){
		setTimeout(function(){
			$('#ads-size-display,#ads-size-overlay').multipleSelect({
				single: true,
				filter: true,
				width: '100%'
			});
		},200);
	}

	function get_type(id){
		for(var i in type){
			if (id == i) {
				return type[i];
			}
		}
		return false;
	}
	function get_type_key(value){
		for(var i in type){
			if (value == type[i]) {
				return i;
			}
		}
		return false;
	}

	$("#table-placement").DataTable({"pageLength": 25});

	//using validatr.js
	plt_form.validatr({
		location: 'left',
		//showall: true
	});
	//custom valid
	plt_form.validatr('addTest', {
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

	//event modal
	$('#modal-placement').on('hide.bs.modal', function (e) {
		$("#plt_container .editing").removeClass("editing");
		$('.row-size-display').hide();
	});

	$(document).on('click','.action-btn', function(){
		$('#action-placement').modal('show');
		var row = $(this).closest('tr');
		var id = row.find('.plt_id').text();
		var code = '<ins class="adsplay-placement" id="aplpm-'+id+'" ></ins><script src="https://st.adsplay.net/js/adsplay-display-ad.min.js"></script>'
		$("#plt_code").val(code);
	});

	$(document).on('click','#plt_copy', function(){
		 //Before we copy, we are going to select the text.
		var text = document.getElementById('plt_code');
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
		//add to clipboard.
		document.execCommand('copy');
	});

	// CREATE
	$('#new-placement').click(function(){
		$('#modal-placement').modal('show');
		//empty form
		plt_form.find('input, textarea, select').val("");

		select_render();
	});

	// EDIT
	$(document).on('click','.edit-placement', function(){

		var row = $(this).closest('tr');
		var id = row.find('.plt_id').text();
		$('#modal-placement').modal('show');
		row.addClass('editing');

		$.ajax({
			url: '/placement/find/'+id,
			type: "GET",
			contentType: "application/json",
			dataType:'json',
			beforeSend: function(){
				$('#modal-placement .modal-content').append('<div class="loader"></div>');
			},
			success: function(result){
				$('.loader').remove();

				plt_edit_render(result);

				$('#ads-publisher').val(result.publisher._id);
			}
		});

	});

	$('#ads-type').change(function(){
		if ($(this).val() == 2) {
			$('.row-size-display').show();
		}
		else{
			$('.row-size-display').hide();
		}
	});

	plt_form.submit(function(e) {
		e.preventDefault();
		//check valid form
		if (! $.validatr.validateForm(plt_form)) {
			return false;
		}

		//Array attribute name of input , select , textarea , radio, checkbox
		var nameInput = ['id','name','publisher','type','size','adCode3rd',
							'weight3rd','baseDomain','checkBaseDomain','enabled'];
		var data = getFormData(plt_form);
		var filter = plt_filter_data(data);

		$.ajax({
			url: '/placement/save',
			type: "POST",
			contentType: "application/json",
			dataType:'json',
			data: JSON.stringify(filter),
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

	function plt_edit_render(result) {
		for(var i in result){
			var _this = $('[name="'+i+'"]');

			if(i == '_id'){
				$('[name="id"]').val(result[i]);
			}
			else if(i == "enabled" || i == "checkBaseDomain"){
				if (result[i]) {
					_this.attr('checked','checked');
				}
				else{
					_this.removeAttr('checked');
				}
			}
			else if(i == "type"){
				if (result[i] == 2) {
					$('.row-size-display').show();
					_this.val(result[i]);
					select_render();
				}
			}
			else{
				_this.val(result[i]);
			}
			
		}

		var get_w = result['width'];
		var get_h = result['height'];
		var get_size = get_w+"x"+get_h;
		setTimeout(function(){
			$("#ads-size-display").multipleSelect("setSelects", [get_size]);
		},200);
	}

	function plt_filter_data(data){
		var result = {};
		for(var i in data){
			if(i == 'checkBaseDomain' || i == 'enabled'){
				result[i] = data[i][0];
			}
			else if(i == 'size'){
				var size = (data[i].length > 0) ? data[i].split('x') : [0,0];
				result['width'] = size[0];
				result['height'] = size[1];
			}
			else{
				result[i] = data[i];
			}
		}
		return result;	
	}

	function plt_print(data){
		var html = '\
					<tr> \
						<td class="plt_id">'+data._id+'</td> \
						<td class="plt_name">'+data.name+'</td> \
						<td class="plt_publisher">'+data.publisher+'</td> \
						<td class="plt_type">'+get_type(data.type)+'</td> \
						<td class="plt_w">'+data.width+'</td> \
						<td class="plt_h">'+data.height+'</td> \
						<td class="plt_updatedDate">'+ moment(data.updatedDate).format("YYYY-MM-DD")+'</td> \
						<td width="60px"> \
							<button type="button" id="'+data.id+'" class="btn btn-primary btn-xs action-btn" title="action"> \
								<i class="fa fa-file-code-o"></i> \
							</button> \
							<button type="button" id="'+data.id+'" class="btn btn-primary btn-xs edit-placement"> \
								<i class="fa fa-pencil"></i> \
							</button> \
						</td> \
					</tr> \
				';
		return html;		
	}
});