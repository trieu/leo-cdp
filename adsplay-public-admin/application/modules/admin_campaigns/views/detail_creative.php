<?php
/**
 * Created by PhpStorm.
 * User: mith
 * Date: 5/19/2016
 * Time: 3:34 PM
 */
?>
<?php // var_dump($data);die; ?>
<h4 class="page-title">DETAIL CREATIVE</h4>


<div class="block-area">
    <div class="row m-container">

        <div class="col-md-5">
            <div class="tile">
            <h2 class="tile-title">Video</h2>

                <video width="545" height="306" id="multiCodec" poster="//adsplay.net/img/logo.png" controls="controls" preload="none"> <!-- id could be any according to you -->
                    <!-- MP4 source must come first for iOS -->
                    <source type="video/mp4" src="http://ads.fptplay.net.vn/static/ads/instream/cf92e0cc47c8754827ddd3e89c146bee.mp4" />

                </video>

            </div>
        </div>
        <div class="col-md-7">

        <!-- Calendar -->
        <div class="tile">
            <div class="panel panel-default">
                <h2 class="tile-title">Summary Report </h2>
                <div class="panel-body">
                    <div class="block-area" id="tableStriped">
                        <div class="table-responsive overflow">
                            <table class="tile table table-bordered table-striped">
                                <tbody>
                                <tr>
                                    <td>Created date</td>
                                    <td><?php echo date("Y-m-d",$data[0]->created_date); ?> </td>

                                </tr>
                                <tr>
                                    <td>Expired date</td>
                                    <td><?php echo date("Y-m-d",$data[0]->expired_date); ?></td>

                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td><?php echo $data[0]->status ?></td>

                                </tr>
                                <tr>
                                    <td>Click Through URL</td>
                                    <td><?php echo $data[0]->click_through ?></td>

                                </tr>
                                <tr>
                                    <td>Total Booking</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Daily Booking</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Hourly Booking</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Click-through Rate (CTR)</td>
                                    <td>0%</td>

                                </tr>
                                <tr>
                                    <td>Completed-View Rate (CVR)</td>
                                    <td>0%</td>

                                </tr>
                                <tr>
                                    <td>Total Impression</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Total Completed View</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Total Click</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Audience Reach</td>
                                    <td>0</td>

                                </tr>
                                <tr>
                                    <td>Total Revenue</td>
                                    <td>0</td>

                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



        </div>

        </div>
        <div class="block-area">
        <!-- Chart -->
            <div class="tile">
             <h2 class="tile-title">Daily Report</h2>

               <div class="p-10">
                    <div id="line-chart" class="main-chart" style="height: 250px"></div>
                </div>
            </div>
            <div class="tile">
                <h2 class="tile-title">Daily Report</h2>

                <div class="p-10">
                    <div id="bar-chart" class="main-chart" style="height: 250px"></div>
                </div>
            </div>
        </div>
    </div>
</div>