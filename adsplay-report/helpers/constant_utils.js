/**
 * Created by trieu on 5/27/15.
 */

var statuses = {0:'Invalid', 1:'Pending', 2: 'Running', 3 : 'Finished', 4 : 'Expired'};
var adTypes = {0:'Invalid', 1:'In-Stream', 2: 'Expandable Overlay Banner',
    3 : 'Overlay Banner', 4 : 'Break-News'};

var placements = {
    0 : 'Demo',
    100:'Demo', 101:'Live TV for Web', 102:'VOD for Web', 103:'Nhacso.net',120:'FShare-TVC',121:'FShare-DisplayAds',
    201: 'Live TV for SmartTV', 202: 'VOD for SmartTV',
    301 : 'Live TV for Mobile App', 302 : 'VOD for Mobile App',333 : 'Demo', 307 : 'Android-Box LiveTV',308 : 'Android-Box VOD',
    401 : 'FptPlay-Overlay'
};
var userNames = {1000:'Admin', 1001: 'Manager', 1002: 'Customer', 1003 : 'epl_fptplay',
    1004: 'Lava', 1005: 'Ambient', 1006: 'iTVad_Sale',1007:'PayTV_Admin'};
var sites = {'www.fshare.vn': 'FShare' , 'fptplay-live':'FptPlay-LiveEvent' };
var platforms = {1: 'PC Web' , 2:'Mobile Web', 3: 'Tablet', 4:'Mobile App' , 5:'SmartTV' , 6:'IPTV'};



exports.getStatus = function(id) {
    return statuses[id];
};

exports.getAdType = function(id) {
    return adTypes[id];
};

exports.getUserName = function(id) {
    return userNames[id];
};

exports.getPlacement = function(id) {
    return placements[id];
};

exports.getSite = function(id) {
    return sites[id];
};


exports.getPlatform = function(id) {
    return platforms[id];
};

exports.getFemaleKeywords = function(){
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

exports.getMaleKeywords = function(){
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
exports.getPayTVCategories = function(){
    var cats;
    cats = [
        {
            "ID": "2",
            "Category": "Hành Động"
        },
        {
            "ID": "6",
            "Category": "KINH DỊ"
        },
        {
            "ID": "11",
            "Category": "HOẠT HÌNH"
        },
        {
            "ID": "13",
            "Category": "TÂM LÝ"
        },
        {
            "ID": "14",
            "Category": "PHIM BỘ HOA NGỮ"
        },
        {
            "ID": "15",
            "Category": "HÀI"
        },
        {
            "ID": "16",
            "Category": "TÀI LIỆU"
        },
        {
            "ID": "20",
            "Category": "PHIM BỘ HÀN QUỐC"
        },
        {
            "ID": "23",
            "Category": "PHIM BỘ VIỆT NAM"
        },
        {
            "ID": "24",
            "Category": "TÌNH CẢM"
        },
        {
            "ID": "25",
            "Category": "PHIM BỘ ÂU MỸ"
        },
        {
            "ID": "28",
            "Category": "PHIM GIA ĐÌNH"
        },
        {
            "ID": "33",
            "Category": "PHIM BỘ KHÁC"
        }
    ];
    return cats;
}

exports.statuses= statuses;
exports.placements = placements;
exports.sites = sites;
exports.platforms = platforms;