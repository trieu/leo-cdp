$(window).load(function() {
    function action_btn(){
        if($('#ads_status').attr("data-status") == "Running"){
                $('#ads_status').parent().append('<i id="action_btn" class="fa fa-toggle-on color-green" title="Turn On/Off Ads"></i>');
            }
            else if($('#ads_status').attr("data-status") == "Pending"){
                $('#ads_status').parent().append('<i id="action_btn" class="fa fa-toggle-off color-green" title="Turn On/Off Ads"></i>');
            }
    }
    action_btn();

    $(document).on("click", "#action_btn", function(){
        var row = $(this).parent();
        var id = get_id_url();
        console.log(id)
        var btnAction = $(this);
        
        if (btnAction.is('.fa-toggle-on')) {
            update_status(id, {status: '1'}, function(result){
                if(result.message == 'error'){
                    return alert("error !!!")
                }
                btnAction.removeClass('fa-toggle-on');
                btnAction.addClass('fa-toggle-off');
                row.find('span').text('Pending');
            });
        }
        else{
            update_status(id, {status: '2'}, function(result){
                if(result.message == 'error'){
                    return alert("error !!!")
                }
                btnAction.removeClass('fa-toggle-off');
                btnAction.addClass('fa-toggle-on');
                row.find('span').text('Running');
            });
        }
    });

    function update_status(id, obj, callback){
        $.ajax({
            url: '/creative/'+id+'/update',
            type: "POST",
            contentType: "application/json",
            dataType:'json',
            data: JSON.stringify(obj),
            success: callback
        });
    }

    //check url edit {return id or false}
    function get_id_url(){
        var url_split = window.location.href.split("/");
        var id = url_split[url_split.length - 1];
        return id;
    }

});