$(function() {

  //datepicker plugin
  function date_call(){
    $('.begin_date,.end_date').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('.begin_time,.end_time').datetimepicker({
      format: 'LT'
    });
    $(".begin_date").on("dp.change", function (e) {
      var pa = $(this).parents('.form-group-wrap');
      pa.find('.end_date').data("DateTimePicker").minDate(e.date);
    });
    $(".end_date").on("dp.change", function (e) {
      var pa = $(this).parents('.form-group-wrap');
      pa.find('.begin_date').data("DateTimePicker").maxDate(e.date);
    });
  }
  date_call();

  function dataFilter(el){
    var schedules = [];
    var _id = el.find('[name="_id"]').val();
    var name = el.find('[name="name"]').val();
    el.find('.form-group-wrap').each(function(){
      var begin = $(this).find('[name="begin_date"]').val() + ", " + $(this).find('[name="begin_time"]').val();
      var end = $(this).find('[name="end_date"]').val() + ", " + $(this).find('[name="end_time"]').val();
      var booking = parseInt($(this).find('[name="booking"]').val()) || 0;
      schedules.push({begin: begin, end: end, booking: booking});
    });

    if(_id == null ||_id == ""){
      return {message: "Ads is empty ! please select a Ads"};
    }

    return {_id: _id, name : name, schedules: schedules};

  }

  //chosen plugin
  $("#ads_select").chosen({width: "100%", no_results_text: "Oops, nothing found!"});
  var ads_id = $('#ads_select').attr('data-value') || "";
  $('#ads_select').val(ads_id).trigger('chosen:updated');

  //clone schedules
  $(document).on('click','#schedules-plus', function(e){
    e.preventDefault();
    var copy = $('.form-group-wrap:first').clone();
    $('#schedules').append(copy);
    date_call();
  });


  //submit form
  $('#flight-form').submit(function(e){
    event.preventDefault();
    var data = dataFilter($(this));
    if(typeof(data.message) != "undefined" ){
      modal_alert(data.message);
      return false;
    }

    $.ajax({
      url: $(this).attr('action'),
      data: data,
      type: "POST",
      success: function(data){
        if(!data.message){
          window.location = location.protocol+'//'+location.host+'/flight/';
        }
        else{
          window.location = location.protocol+'//'+location.host+'/flight/find/'+data._id;
        }
      }
    });

  });
  
});