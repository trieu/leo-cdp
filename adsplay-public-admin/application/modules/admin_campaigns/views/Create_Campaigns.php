<!-- Bootstrap modal -->
<div class="modal fade" id="modal_form_Campaign" role="dialog" aria-labelledby="myLargeModalLabel">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 class="modal-title">Campaign Form</h3>
            </div>
            <div class="modal-body form">
                <form action="#" id="formCampaign" class="form-horizontal" novalidate>
                    <input type="hidden" value="" name="id"/>
                    <div class="form-body">
                        <div class="form-group item">
                            <label class="control-label col-md-2 col-sm-3 col-xs-12" for="first-name">Name <span class="required">*</span>
                            </label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <input type="text" name="name" required="required" class="form-control col-md-7 col-xs-12">
                            </div>

                        </div>
                        <div class="form-group item">
                            <label for="middle-name" class="control-label col-md-2 col-sm-3 col-xs-12">Brand</label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <select name="brand_id" class="form-control">
                                </select>
                            </div>
                            <div class="test"></div>
                        </div>
                        <div class="form-group item">
                            <label for="middle-name" class="control-label col-md-2 col-sm-3 col-xs-12">Product</label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <select name="product_id" class="form-control">
                                </select>
                            </div>
                            <div class="test"></div>
                        </div>
                        <div class="form-group item">
                            <label for="middle-name" class="control-label col-md-2 col-sm-3 col-xs-12">Sector</label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <select name="sector_id" class="form-control">
                                </select>
                            </div>
                            <div class="test"></div>
                        </div>
                        <div class="form-group item">
                            <label class="control-label col-md-2 col-sm-3 col-xs-12" for="first-name">Unit <span class="required">*</span>
                            </label>
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <input type="text" name="unit" required="required" class="form-control col-md-7 col-xs-12">
                            </div>

                        </div>

                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" id="btnSave" onclick="save('Campaign')" class="btn btn-primary">Save</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            </div>
        </div><!-- /.modal-content onclick="save()" -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- End Bootstrap modal -->
