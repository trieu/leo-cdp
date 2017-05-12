/**
 * Created by trieu on 5/27/15.
 */

var dbConfig = require('../configs/database');
console.log(dbConfig.url);

var MongoClient = require('mongodb').MongoClient;

var MJ = require("mongo-fast-join"),
    mongoJoin = new MJ();

MongoClient.connect(dbConfig.url, function (err, db) {

    console.log("Connected correctly to server");

    //

    mongoJoin
        .query(
        db.collection("creatives"),
        {}, //query statement
        {}, //fields
        {
            limit: 10//options
        }
    )
        .join({
            joinCollection: db.collection("creative_stats"),
            //respects the dot notation, multiple keys can be specified in this array
            leftKeys: ["crtID"],
            //This is the key of the document in the right hand document
            rightKeys: ["crtID"],
            //This is the new subdocument that will be added to the result document
            newKey: "stats"
        })
        //Call exec to run the compiled query and catch any errors and results, in the callback
        .exec(function (err, items) {
            console.log(JSON.stringify(items, null, 4));
            db.close();
        });

});