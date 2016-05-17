<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<style>
    .error-input{
        padding-left: 160px;
        font-weight: bold;
        /*color: #d90004;*/
    }
</style>

<!-- Bootstrap modal -->
<div class="modal fade" id="modal_form_User" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 class="modal-title">User Form</h3>
            </div>
            <div class="modal-body form">
                <?php echo form_open('',array('class'=>'form-horizontal','id'=>'formUser'));?>
                <div class="form-group">
                    <input type="hidden" value="" name="id"/>
                    <div class="error-input first_name"><?php echo form_error('first_name');  ?></div>
                    <?php
                    echo form_label('First name','first_name', array('class'=>'col-sm-3 control-label'));?>

                    <div class="col-sm-9"> <?php  echo form_input('first_name',set_value('first_name'),'class="form-control"');?> </div>

                </div>
                <div class="form-group">
                    <div class="error-input last_name"><?php echo form_error('last_name');  ?></div>
                    <?php
                    echo form_label('Last name','last_name',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"> <?php echo form_input('last_name',set_value('last_name'),'class="form-control"');?></div>

                </div>
                <div class="form-group">
                    <div class="error-input company"><?php echo form_error('company');  ?></div>
                    <?php
                    echo form_label('Company','company',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"><?php echo form_input('company',set_value('company'),'class="form-control"');?></div>

                </div>
                <div class="form-group">
                    <div class="error-input phone"><?php echo form_error('phone');  ?></div>
                    <?php
                    echo form_label('Phone','phone',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"><?php echo form_input('phone',set_value('phone'),'class="form-control"');?></div>

                </div>
                <div class="form-group">
                    <div class="error-input username"><?php echo form_error('username');  ?></div>
                    <?php
                    echo form_label('Username','username',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"> <?php echo form_input('username',set_value('username'),'class="form-control"');?></div>

                </div>
                <div class="form-group">
                    <div class="error-input email"><?php echo form_error('email');  ?></div>
                    <?php
                    echo form_label('Email','email',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"> <?php echo form_input('email',set_value('email'),'class="form-control"');?> </div>

                </div>
                <div class="form-group">
                    <div class="error-input password"><?php echo form_error('password');  ?></div>
                    <?php
                    echo form_label('Password','password',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"><?php echo form_password('password','','class="form-control"');?> </div>

                </div>
                <div class="form-group">
                    <div class="error-input password_confirm"><?php echo form_error('password_confirm');  ?></div>
                    <?php
                    echo form_label('Confirm password','password_confirm',array('class'=>'col-sm-3 control-label'));
                    ?>
                    <div class="col-sm-9"><?php echo form_password('password_confirm','','class="form-control"');?> </div>

                </div>
                <div class="form-group">
                    <?php
                    if(isset($groups))
                    {
                        echo form_label('Groups','groups[]',array('class'=>'col-sm-3 control-label'));
                        foreach($groups as $group)
                        {
                            echo '<div class="col-sm-9 checkbox" style="float: right">';
                            echo '<label class="col-sm-3">';
                            echo form_checkbox('groups[]', $group->id, set_checkbox('groups[]', $group->id),'class="checkRole"');
                            echo ' '.$group->name;
                            echo '</label>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>


                <?php echo form_close();?>
            </div>
            <div class="modal-footer">
                <button type="submit" id="btnSave_user" onclick="saveUser()" class="btn btn-primary">Save</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            </div>
        </div><!-- /.modal-content onclick="save()" -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- End Bootstrap modal -->

<!--<div class="container">-->
<!--    <div class="row">-->
<!--        <div class="col-lg-6">-->
<!--            <div class="block-area" id="input-masking">-->
<!--                <h3 class="block-title">CREATE USER</h3>-->
<!--                <div class="panel-body">-->
<!--                   -->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->
<script type="application/javascript">
    $(document).ready(function(){
        $( "#btnSave_user" ).click(function( event ) {


        });
    });
</script>
<style>
    .error-input{
        text-align: center;
        font-size: 15px;
        color: red;
    }
</style>