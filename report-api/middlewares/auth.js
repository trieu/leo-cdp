/**
 * Created by trieu on 5/27/15.
 */

var modelUtils = require('../helpers/model_utils');

module.exports = function(req, res, next) {
    if (req.sessionid  > 0) {
        console.log(req.url);
        if(req.url === '/login'){
           // res.redirect('/');
        } else {
            next()
        }
    } else {
        //res.render('common/no-auth',  modelUtils.baseModel());
        res.redirect('/user/login');
    }
}