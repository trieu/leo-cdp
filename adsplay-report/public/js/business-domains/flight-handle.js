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

  //chosen plugin
  $("#ads_select").chosen({width: "100%", no_results_text: "Oops, nothing found!"});
  $('#ads_select').val('').trigger('chosen:updated');

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
    var data = getFormData($(this));
  });
  
});