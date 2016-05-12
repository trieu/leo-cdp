 <div class="tile">
        <h2 class="tile-title">DELIVERY SETTING</h2>
        <div class="col-md-6">
            <div class="row" style="margin: 10px 0px;">
                <p class="col-md-2">Location: </p>
                <label class="checkbox-inline">
                    <input type="checkbox" checked>Everywhere
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">
                    Vietnam
                </label>
            </div>
            <div class="row" style="margin-bottom: 10px;">
                <p class="col-md-2">Frequency: </p>
                <div class="col-md-3">
                    <select class="select">
                        <?php for ($i = 3; $i <= 20; $i++): ?>
                        <option><?php echo $i; ?></option>
                        <?php endfor ;?>
                        <option>Non Defined</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="select">
                        <option>Per Day</option>
                        <option>Per Week</option>
                        <option>Per Month</option>
                    </select>
                </div>
            </div>
            <div class="row" style="margin-bottom: 10px;">
                <p class="col-md-2">Day part: </p>

                <label class="checkbox-inline">
                    <input type="checkbox" checked>0h-5h59
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">6h-11h59
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">12h-17h59
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">18h-23h59
                </label>
            </div>
            <div class="row">
                <p class="col-md-2">Audience Reac: </p>
                <div class="col-lg-8"><input type="text" name="" placeholder="the number of audience to reach" class="form-control m-b-10"></div>
            </div>
            <div class="row">
                <div class="text-center"><button style="margin: 10px 0;" type="button" class="btn btn-default">Check available</button></div>
            </div>
            <div class="row">
                <p class="col-md-2">Audience Gender: </p>
                <label class="checkbox-inline">
                    <input type="checkbox" checked>Male
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">Female
                </label>
            </div>
            <div class="row">
                <p class="col-md-2">Audience Age: </p>
                <label class="checkbox-inline">
                    <input type="checkbox" checked>15-24
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">25-34
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">35-44
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox">45+
                </label>
            </div>
        </div>
        <div class="col-md-6" style="margin: 10px 0px;">
            <div class="row">
                <p class="col-md-2">Buying Model: </p>
                <label class="radio-inline" title="Cost Per True View (CPV)">
                    <input type="radio" name="optionsRadiosInline" value="option2" checked>CPV
                </label>
                <label class="radio-inline" title="Cost Per Click (CPC)">
                    <input type="radio" name="optionsRadiosInline" value="option1">CPC
                </label>
                <label class="radio-inline" title="Cost Per Impression (CPM)">
                    <input type="radio" name="optionsRadiosInline" value="option1">CPM
                </label>
            </div>
            <div class="row">
                <p>Booking value: </p>
                <div class="col-lg-10"><input type="text" name="" placeholder="the number of booking" class="form-control"></div>
            </div>
            <div class="row" style="margin-bottom: 10px;">
                <p>Booking Type: </p>
                <div class="col-lg-10"><select class="select">
                    <option>Auto distributed</option>
                    <option>Per Day</option>
                    <option>Per Week</option>
                    <option>Per Month</option>
                </select></div>
            </div>
            <div class="row">
                <div class="form-group">
                    <p class="col-md-2">Devices: </p>
                    <label class="checkbox-inline">
                        <input type="checkbox" checked>Desktop
                    </label>
                    <label class="checkbox-inline">
                        <input type="checkbox">Mobile
                    </label>
                    <label class="checkbox-inline">
                        <input type="checkbox">Smart TV
                    </label>
                    <label class="checkbox-inline">
                        <input type="checkbox">Android TVBox
                    </label>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="text-center">
                <button style="margin-bottom:10px;" id="add-brand" class="btn btn-info">RUN AD UNIT</button>
            </div>
        </div>
    </div>
