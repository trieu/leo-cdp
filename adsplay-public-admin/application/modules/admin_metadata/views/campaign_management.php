<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 9/4/2015
 * Time: 3:52 PM
 */
//var_dump($listCampaigns);die;
?>
<div class="col-lg-6">
        <div class="tile">
            <h2 class="tile-title">CAMPAIGN MANAGEMENT INFORMATION</h2>

        <div class="p-10">
            <div class="error-campaign" style="font-weight: bold;color:red"></div>

            <form class="form-horizontal form-management" id="form-management">
                <fieldset>

                    <div class="form-group">
                        <label class="col-sm-3 control-label"> Name:
                            <input type="radio" name="optionsRadios" id="optionsRadios2" value="option1"
                                   checked="checked">
                        </label>
                        <div class="col-sm-9">
                            <input type="text" name="campaign-name" class="col-sm-6 form-control disable-text-campaign">

                            <div class="fa-check-campaign" style="display: none"><i class="fa fa-check"></i></div>
                        </div>
                    </div>

                    <div class="form-group check-error-campaign" style="display: none">
                        <label class="col-sm-3 control-label"></label>

                        <div class="col-sm-9">
                            <div class="alert alert-danger" style="padding: 5px;">
                                Campaign exist. Please choose name campaign different!
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">
                            <input type="radio" name="optionsRadios" id="optionsRadios1" value="option2">

                        </label>
                        <div class="col-sm-9">
                            <select class="form-control disabled-campaign" name="campaign-name" disabled>
                            <option value="0" <?php echo set_select('campaign-name', '0', TRUE, 1); ?>>Add to
                                campaign
                            </option>
                            <?php foreach ($listCampaigns as $campaign): ?>
                            <option
                                value="<?php echo $campaign->campaign_name ?>"><?php echo $campaign->campaign_name ?></option>
                            <?php endforeach;?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Ad Unit Title</label>

                        <div class="col-sm-9">
                            <input type="text" name="unit-title" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Brand</label>

                        <div class="col-sm-9">
                            <select class="form-control" id="choose-brand" name="brand-name">
                                <option value="0">Add as brand</option>
                                <?php foreach ($listBrand as $brand): ?>
                                    <option
                                        value="<?php echo $brand->id ?>"><?php echo $brand->brand_name ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Product</label>

                        <div class="col-sm-9">
                            <select class="form-control product-name" id="choose-product"
                                                      name="product-name">
                                <option>Add as product</option>

                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Sector</label>

                        <div class="col-sm-9">
                            <select class="form-control sector-name" name="sector-name">
                                <option>Add as sector</option>
                            </select>
                        </div>
                    </div>

                </fieldset>
                <input type="hidden" name="url_redirect" value="">
            </form>
        </div>
        </div>
</div>
