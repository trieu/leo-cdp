var moment = require('moment')
var request = require('request')
var Common = require('../../configs/common')

exports.apiRolesAds = function (req, res){

    try{
        var end = moment().add(30, 'days').format("YYYY-MM-DD");
        var begin = moment().subtract(90, 'days').format("YYYY-MM-DD");
        var url = Common.domain.api + '/api/creative/summary?begin='+begin+'&end='+end;
        // result from callback
        
        request(url ,function (err, response, body) {
            var data = [];
            if(!err && response.statusCode == 200){
                var result = JSON.parse(body);
                
                for(var i in result){
                    data.push({
                        id: result[i].id,
                        name: result[i].name,
                        status: result[i].status,
                        runDate: moment(new Date(result[i].runDate)).format("YYYY-MM-DD"),
                        expiredDate: moment(new Date(result[i].expiredDate)).format("YYYY-MM-DD")
                    })
                }
                
                res.json(data);
            }
            else{
                console.error(err);
                res.json(data);
            }
        });
    }

    catch (e) {
        console.error(e);
    }
}

exports.apiRolesPlacement = function (req, res){

    try{
        var dataPlacement = [
            {
                id: 1000,
                name: "FptPlay_demo-300x250",
                type: "Display Banner"
            },
            {
                id: 1001,
                name: "StarTalk-Placement-Homepage",
                type: "Display Banner"
            },
            {
                id: 1002,
                name: "FptPlay-Top-Home-responsive",
                type: "Display Banner"
            },
            {
                id: 1003,
                name: "FptPlay-Middle-home-responsive",
                type: "Display Banner"
            },
            {
                id: 1004,
                name: "FptPlay-Bottom-Home-responsive",
                type: "Display Banner"
            },
            {
                id: 1005,
                name: "FptPlay-Details-Page-responsive",
                type: "Display Banner"
            },
            {
                id: 1006,
                name: "FptPlay-EPL-870x100",
                type: "Display Banner"
            },
            {
                id: 1007,
                name: "FptPlay-EPL-300x600",
                type: "Display Banner"
            },
            {
                id: 1008,
                name: "FptPlay-Mobile-Bottom",
                type: "Display Banner"
            },
            {
                id: 1009,
                name: "FptPlay-Mobile-Infeed-Video",
                type: "video"
            },
            {
                id: 1010,
                name: "FptPlay-Web-InPageVideo",
                type: "video"
            },
            {
                id: 1011,
                name: "FptPlay-VOD-LeftSidePlayer",
                type: "Display Banner"
            },
            {
                id: 1012,
                name: "FptPlay-VOD-RightSidePlayer",
                type: "Display Banner"
            },
            {
                id: 1013,
                name: "FptPlay-VOD-TopPage",
                type: "Display Banner"
            },
            {
                id: 1014,
                name: "FptPlay-EPL-LeftSidePlayer",
                type: "Display Banner"
            },
            {
                id: 1015,
                name: "FptPlay-EPL-RightSidePlayer",
                type: "Display Banner"
            }
        ];
        res.json(dataPlacement);
    }

    catch (e) {
        console.error(e);
        res.json([]);
    }
}