module.exports = function(roles){
    return function(req, res, next) {
        var message = '<h1>403 Forbidden ! Permission denied</h1>';
        console.log('check role: ', req.user)
        //check error
        if(typeof (req.user) === 'undefined'){
            return res.send(message);
        }
        if(typeof (roles) === 'undefined'){
            return res.send(message);
        }
        if( Object.prototype.toString.call(roles) !== '[object Array]' ) {
            return res.send(message);
        }

        //success
        for(var i in roles){
            //check user role
            if(req.user.roles[roles[i]]){
                //console.log('next')
                return next();
            }
        }

        res.send(message);

    }
}