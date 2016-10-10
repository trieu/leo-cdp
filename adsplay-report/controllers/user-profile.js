/**
 * Created by trieu on 5/28/15.
 */
/**
 * Created by trieu on 5/27/15.
 */

var express = require('express')
    , router = express.Router()
    , User = require('../models/user')
    , modelUtils = require('../helpers/model_utils');

router.get('/details', function (req, res) {
    // {{base_domain}}/user-profile/details
    //console.log(req.query)
   // console.log(req.cookies)
   // console.log(req.ip)
    //console.log(req.ips)
   // console.log(req.originalUrl)

    var data = modelUtils.baseModel(req);
    data.dashboard_title = "User";


    User.get(0, data, function (err, data) {
        data.error = req.query.errorcode === "1";
        res.render('common/user-profile', data)
    })
});



module.exports = router