var todo = require('../configs/models/cats.js');
module.exports = function(app) {
    // select all
    app.get('/cats', function(req, res) {
        todo.find({}, function(err, docs) {
            if(err) return console.error(err);
            res.json(docs);
        });
    });

    // count all
    app.get('/cats/count', function(req, res) {
        todo.count(function(err, count) {
            if(err) return console.error(err);
            res.json(count);
        });
    });

    // create
    app.post('/cat', function(req, res) {
        var obj = new todo(req.body);
        obj.save(function(err, obj) {
            if(err) return console.error(err);
            res.json(obj);
        });
    });

    // find by id
    app.get('/cat/:id', function(req, res) {
        todo.findOne({_id: req.params.id}, function (err, obj) {
            if(err) return console.error(err);
            res.json(obj);
        })
    });

    // update by id
    app.put('/cat/:id', function(req, res) {
        todo.findOneAndUpdate({_id: req.params.id}, req.body, function (err) {
            if(err) return console.error(err);
            res.sendStatus(200);
        })
    });

    // delete by id
    app.delete('/cat/:id', function(req, res) {
        todo.findOneAndRemove({_id: req.params.id}, function(err) {
            if(err) return console.error(err);
            res.sendStatus(200);
        });
    });
};