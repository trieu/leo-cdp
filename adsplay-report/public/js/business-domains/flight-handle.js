$(function() {
  $('#begin_date,#end_date').datetimepicker({
    format: 'YYYY-MM-DD'
  });
  $('#begin_time,#end_time').datetimepicker({
    format: 'LT'
  });

  $("#begin_date").on("dp.change", function (e) {
      $('#end_date').data("DateTimePicker").minDate(e.date);
  });
  $("#end_date").on("dp.change", function (e) {
      $('#begin_date').data("DateTimePicker").maxDate(e.date);
  });

  $("#ads_select").chosen({width: "100%", no_results_text: "Oops, nothing found!"});
  $('#ads_select').val('').trigger('chosen:updated');
  
});