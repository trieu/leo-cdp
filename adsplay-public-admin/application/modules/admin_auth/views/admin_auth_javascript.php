<script>
    var table;
    $(document).ready(function() {

        table = $('#datatable-Campaign').DataTable({
            // Load data for the table's content from an Ajax source
            "ajax": {
                "url": "<?php echo site_url('/admin_auth/Auth/getajax')?>",
                "type": "POST"
            }

        });

    });
    function reload_table()
    {
        table.ajax.reload(null,false); //reload datatable ajax
    }
    function LockAndUnlockUser(id)
    {
        // ajax adding data to database

        $.ajax({
            url : "<?php echo site_url('/admin_auth/Auth/LockAndUnlockUser')?>",
            type: "POST",
            data: {id:id},
            success: function(data) {
                //if success close modal and reload ajax table
                reload_table();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error adding / update data');
            }
        });
    }
</script>