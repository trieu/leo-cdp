/**
 * Created by trieu on 5/27/15.
 */
var fs = require('fs');

var statuses = {0: 'Invalid', 1: 'Pending', 2: 'Running', 3: 'Finished', 4: 'Expired'};
var adTypes = {0: 'Invalid', 1: 'Instream TVC', 2: 'Expandable Overlay Banner', 3: 'In-video Overlay Banner',
 4: 'In-video Break News Text', 5: 'HTML5 Display AD', 6: 'Display Image Banner', 7: 'In-page TVC Video',
 8: 'Sponsored Video Content', 9: 'Bidding Ad Code', 10: "Streaming Video AD", 11: 'Master Head TVC Mobile ', 12: 'Infeed TVC Mobile' };

var placements = {
    0: 'Demo',
    100: 'Demo', 101: 'Live TV for Web', 102: 'VOD for Web', 111: 'Masterhead Web',112: 'Infeed Web', 120: 'FShare-TVC', 121: 'FShare-DisplayAds',
    201: 'Live TV for SmartTV', 202: 'VOD for SmartTV',
    301: 'Live TV for Mobile App', 302: 'VOD for Mobile App', 333: 'Demo', 307: 'Android-Box LiveTV', 308: 'Android-Box VOD',
    320: 'PayTV-VOD',
    401: 'FptPlay-Overlay', 411: 'Masterhead Mobile',412: 'Infeed Mobile'
};
var userNames = {1000: 'Admin', 1001: 'Manager', 1002: 'Customer', 1003: 'epl_fptplay',
    1004: 'Lava', 1005: 'Ambient', 1006: 'iTVad_Sale', 1007: 'PayTV_Admin'};
var sites = {'www.fshare.vn': 'FShare', 'fptplay-live': 'FptPlay-LiveEvent' };
var platforms = {1: 'PC Web', 2: 'Mobile Web', 3: 'Tablet', 4: 'Mobile App', 5: 'SmartTV', 6: 'IPTV'};

var publishers = { 1: "FptPlay", 2: "Nhacso", 3: "Fshare", 4: "PayTV" };

var size_overlay = [
    {
        "name": "Banner",
        "size": {"w": 468, "h": 60}
    },
    {
        "name": "Leaderboard",
        "size": {"w": 728, "h": 90}
    }
];

var size_display = [
    {
        "name": "StartTalk-Home",
        "size": {"w": 380, "h": 313}
    }
    ,
    {
        "name": "Responsive size",
        "size": {"w": 0, "h": 0}
    }
    ,
    {
        "name": "Banner",
        "size": {"w": 468, "h": 60}
    },
    {
        "name": "Leaderboard",
        "size": {"w": 728, "h": 90}
    },
    {
        "name": "Square",
        "size": {"w": 250, "h": 250}
    },
    {
        "name": "Small square",
        "size": {"w": 200, "h": 200}
    },
    {
        "name": "Inline rectangle",
        "size": {"w": 300, "h": 250}
    },
    {
        "name": "Skyscraper",
        "size": {"w": 120, "h": 600}
    },
    {
        "name": "Half-page",
        "size": {"w": 300, "h": 600}
    },
    {
        "name": "Large leaderboard",
        "size": {"w": 970, "h": 90}
    },
    {
        "name": "Large mobile banner",
        "size": {"w": 320, "h": 100}
    },
    {
        "name": "Billboard",
        "size": {"w": 970, "h": 250}
    },
    {
        "name": "Portrait",
        "size": {"w": 300, "h": 1050}
    },
    {
        "name": "Panorama",
        "size": {"w": 980, "h": 120}
    },
    {
        "name": "Top banner",
        "size": {"w": 930, "h": 180}
    },
    {
        "name": "Triple widescreen",
        "size": {"w": 250, "h": 360}
    },
    {
        "name": "Netboard",
        "size": {"w": 580, "h": 400}
    }
];

exports.getStatus = function (id) {
    return statuses[id];
};

exports.getAdType = function (id) {
    return adTypes[id];
};

exports.getUserName = function (id) {
    if(userNames[id])
        return userNames[id];
    return 'Guest';
};

exports.getPlacement = function (id) {
    return placements[id];
};

exports.getSite = function (id) {
    return sites[id];
};


exports.getPlatform = function (id) {
    return platforms[id];
};

exports.getFemaleKeywords = function () {
    var femaleKeyWords = [];
    femaleKeyWords.push("Phim bộ HOT");
    femaleKeyWords.push("Phim bộ Hoa Ngữ");
    femaleKeyWords.push("Phim bộ Hàn Quốc");
    femaleKeyWords.push("Phim bộ Việt Nam");
    femaleKeyWords.push("Quốc Gia Khác");
    femaleKeyWords.push("Tâm Lý Tình Cảm");
    femaleKeyWords.push("Hài Hước");
    femaleKeyWords.push("TV Show HOT");
    femaleKeyWords.push("TVShow Nổi Bật");
    femaleKeyWords.push("Trò Chơi Truyền Hình");
    femaleKeyWords.push("Lễ Trao Giải");
    femaleKeyWords.push("Sự Kiện");
    femaleKeyWords.push("Đàm Luận");
    return femaleKeyWords;
};

exports.getMaleKeywords = function () {
    var maleKeyWords = [];
    maleKeyWords.push("Phim lẻ HOT");
    maleKeyWords.push("Phim Lẻ");
    maleKeyWords.push("Viễn Tưởng Thần Thoại");
    maleKeyWords.push("Phim Lẻ Nổi Bật, ");
    maleKeyWords.push("Kinh Dị");
    maleKeyWords.push("Hành Động Phiêu Lưu");
    maleKeyWords.push("Bóng Đá Quốc Tế");
    maleKeyWords.push("Bản Tin");
    maleKeyWords.push("Bóng Đá Việt Nam");
    maleKeyWords.push("Xem Lại Trận Đấu Hấp Dẫn");
    maleKeyWords.push("Các Môn Thể Thao Khác");
    maleKeyWords.push("Đối Kháng");
    maleKeyWords.push("Tốc Độ");
    maleKeyWords.push("Quần Vợt");
    maleKeyWords.push("Huyền Thoại Sân Cỏ");
    maleKeyWords.push("League Of Legends");
    maleKeyWords.push("Dota 2");
    maleKeyWords.push("Thường Thức");
    maleKeyWords.push("Trailer");
    return maleKeyWords;
}

//http://dev-fbox-onetv.fpt.vn/OneTVWS.ashx?method=ITVad_TotalView&begintime=2016-06-10&endtime=2016-06-12
exports.getPayTVCategories = function () {
    var obj = JSON.parse(fs.readFileSync('./public/json/PayTVCategories.json', 'utf8'));
    return obj.cats;
}

exports.getLocationCodes = function () {
    var obj = JSON.parse(fs.readFileSync('./public/json/location.json', 'utf8'));
    return obj;
}

exports.statuses = statuses;
exports.placements = placements;
exports.sites = sites;
exports.platforms = platforms;
exports.publishers = publishers;
exports.size_overlay = size_overlay;
exports.size_display = size_display;
exports.adTypes = adTypes;
