/**
 * Created by trieu on 5/27/15.
 */

var statuses = {0: 'Invalid', 1: 'Pending', 2: 'Running', 3: 'Finished', 4: 'Expired'};
var adTypes = {0: 'Invalid', 1: 'In-Stream', 2: 'Expandable Overlay Banner',
    3: 'Overlay Banner', 4: 'Break-News'};

var placements = {
    0: 'Demo',
    100: 'Demo', 101: 'Live TV for Web', 102: 'VOD for Web', 103: 'Nhacso.net', 120: 'FShare-TVC', 121: 'FShare-DisplayAds',
    201: 'Live TV for SmartTV', 202: 'VOD for SmartTV',
    301: 'Live TV for Mobile App', 302: 'VOD for Mobile App', 333: 'Demo', 307: 'Android-Box LiveTV', 308: 'Android-Box VOD',
    320: 'PayTV-VOD',
    401: 'FptPlay-Overlay'
};
var userNames = {1000: 'Admin', 1001: 'Manager', 1002: 'Customer', 1003: 'epl_fptplay',
    1004: 'Lava', 1005: 'Ambient', 1006: 'iTVad_Sale', 1007: 'PayTV_Admin'};
var sites = {'www.fshare.vn': 'FShare', 'fptplay-live': 'FptPlay-LiveEvent' };
var platforms = {1: 'PC Web', 2: 'Mobile Web', 3: 'Tablet', 4: 'Mobile App', 5: 'SmartTV', 6: 'IPTV'};

exports.getStatus = function (id) {
    return statuses[id];
};

exports.getAdType = function (id) {
    return adTypes[id];
};

exports.getUserName = function (id) {
    return userNames[id];
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

exports.getPayTVLocations = function () {
    var locs = [
        {
            "LocID": "4",
            "LocName": "Ha Noi",
            "ConChar": "HN",
            "Area": "1"
        },
        {
            "LocID": "8",
            "LocName": "Ho Chi Minh",
            "ConChar": "SG",
            "Area": "5"
        },
        {
            "LocID": "20",
            "LocName": "Lao Cai",
            "ConChar": "LC",
            "Area": "2"
        },
        {
            "LocID": "22",
            "LocName": "Son La",
            "ConChar": "SL",
            "Area": "2"
        },
        {
            "LocID": "25",
            "LocName": "Lang Son",
            "ConChar": "LS",
            "Area": "2"
        },
        {
            "LocID": "26",
            "LocName": "Cao Bang",
            "ConChar": "CB",
            "Area": "2"
        },
        {
            "LocID": "27",
            "LocName": "Tuyen Quang",
            "ConChar": "TQ",
            "Area": "2"
        },
        {
            "LocID": "29",
            "LocName": "Yen Bai",
            "ConChar": "YB",
            "Area": "2"
        },
        {
            "LocID": "30",
            "LocName": "Ninh Binh",
            "ConChar": "NB",
            "Area": "3"
        },
        {
            "LocID": "31",
            "LocName": "Hai Phong",
            "ConChar": "HP",
            "Area": "3"
        },
        {
            "LocID": "33",
            "LocName": "Quang Ninh",
            "ConChar": "QN",
            "Area": "2"
        },
        {
            "LocID": "36",
            "LocName": "Thai Binh",
            "ConChar": "TB",
            "Area": "3"
        },
        {
            "LocID": "37",
            "LocName": "Thanh Hoa",
            "ConChar": "TH",
            "Area": "3"
        },
        {
            "LocID": "38",
            "LocName": "Nghe An",
            "ConChar": "NA",
            "Area": "3"
        },
        {
            "LocID": "39",
            "LocName": "Ha Tinh",
            "ConChar": "HT",
            "Area": "3"
        },
        {
            "LocID": "52",
            "LocName": "Quang Binh",
            "ConChar": "QB",
            "Area": "4"
        },
        {
            "LocID": "53",
            "LocName": "Quang Tri",
            "ConChar": "QT",
            "Area": "4"
        },
        {
            "LocID": "54",
            "LocName": "Hue",
            "ConChar": "HU",
            "Area": "4"
        },
        {
            "LocID": "55",
            "LocName": "Quang Ngai",
            "ConChar": "QI",
            "Area": "4"
        },
        {
            "LocID": "56",
            "LocName": "Binh Dinh",
            "ConChar": "BI",
            "Area": "4"
        },
        {
            "LocID": "57",
            "LocName": "Phu Yen",
            "ConChar": "PY",
            "Area": "4"
        },
        {
            "LocID": "58",
            "LocName": "Nha Trang",
            "ConChar": "NT",
            "Area": "4"
        },
        {
            "LocID": "59",
            "LocName": "Gia Lai",
            "ConChar": "GL",
            "Area": "4"
        },
        {
            "LocID": "60",
            "LocName": "Kom Tum",
            "ConChar": "KT",
            "Area": "4"
        },
        {
            "LocID": "61",
            "LocName": "Dong Nai",
            "ConChar": "DN",
            "Area": "6"
        },
        {
            "LocID": "62",
            "LocName": "Binh Thuan",
            "ConChar": "BT",
            "Area": "6"
        },
        {
            "LocID": "63",
            "LocName": "Lam Dong",
            "ConChar": "LD",
            "Area": "6"
        },
        {
            "LocID": "64",
            "LocName": "Ba Ria Vung Tau",
            "ConChar": "VT",
            "Area": "6"
        },
        {
            "LocID": "65",
            "LocName": "Binh Duong",
            "ConChar": "BD",
            "Area": "6"
        },
        {
            "LocID": "66",
            "LocName": "Tay Ninh",
            "ConChar": "TI",
            "Area": "6"
        },
        {
            "LocID": "67",
            "LocName": "Dong Thap",
            "ConChar": "DT",
            "Area": "7"
        },
        {
            "LocID": "68",
            "LocName": "Ninh Thuan",
            "ConChar": "NN",
            "Area": "6"
        },
        {
            "LocID": "70",
            "LocName": "Vinh Long",
            "ConChar": "VL",
            "Area": "7"
        },
        {
            "LocID": "71",
            "LocName": "Can Tho",
            "ConChar": "CT",
            "Area": "7"
        },
        {
            "LocID": "72",
            "LocName": "Long An",
            "ConChar": "LA",
            "Area": "7"
        },
        {
            "LocID": "73",
            "LocName": "Tien Giang",
            "ConChar": "TG",
            "Area": "7"
        },
        {
            "LocID": "74",
            "LocName": "Tra Vinh",
            "ConChar": "TV",
            "Area": "7"
        },
        {
            "LocID": "75",
            "LocName": "Ben Tre",
            "ConChar": "BE",
            "Area": "7"
        },
        {
            "LocID": "76",
            "LocName": "An Giang",
            "ConChar": "AG",
            "Area": "7"
        },
        {
            "LocID": "77",
            "LocName": "Kien Giang",
            "ConChar": "KG",
            "Area": "7"
        },
        {
            "LocID": "79",
            "LocName": "Soc Trang",
            "ConChar": "ST",
            "Area": "7"
        },
        {
            "LocID": "210",
            "LocName": "Phu Tho",
            "ConChar": "PT",
            "Area": "2"
        },
        {
            "LocID": "211",
            "LocName": "Vinh Phuc",
            "ConChar": "VP",
            "Area": "2"
        },
        {
            "LocID": "218",
            "LocName": "Hoa Binh",
            "ConChar": "HB",
            "Area": "2"
        },
        {
            "LocID": "219",
            "LocName": "Ha Giang",
            "ConChar": "",
            "Area": ""
        },
        {
            "LocID": "230",
            "LocName": "Dien Bien",
            "ConChar": "DB",
            "Area": "2"
        },
        {
            "LocID": "231",
            "LocName": "Lai Chau",
            "ConChar": "",
            "Area": ""
        },
        {
            "LocID": "240",
            "LocName": "Bac Giang",
            "ConChar": "BG",
            "Area": "2"
        },
        {
            "LocID": "241",
            "LocName": "Bac Ninh",
            "ConChar": "BN",
            "Area": "2"
        },
        {
            "LocID": "280",
            "LocName": "Thai Nguyen",
            "ConChar": "TN",
            "Area": "2"
        },
        {
            "LocID": "281",
            "LocName": "Bac Can",
            "ConChar": "BC",
            "Area": ""
        },
        {
            "LocID": "320",
            "LocName": "Hai Duong",
            "ConChar": "HD",
            "Area": "3"
        },
        {
            "LocID": "321",
            "LocName": "Hung Yen",
            "ConChar": "HY",
            "Area": "3"
        },
        {
            "LocID": "350",
            "LocName": "Nam Dinh",
            "ConChar": "ND",
            "Area": "3"
        },
        {
            "LocID": "351",
            "LocName": "Ha Nam",
            "ConChar": "HM",
            "Area": "3"
        },
        {
            "LocID": "500",
            "LocName": "Dac Lac",
            "ConChar": "DL",
            "Area": "4"
        },
        {
            "LocID": "501",
            "LocName": "Dac Nong",
            "ConChar": "",
            "Area": ""
        },
        {
            "LocID": "510",
            "LocName": "Quang Nam",
            "ConChar": "QA",
            "Area": "4"
        },
        {
            "LocID": "511",
            "LocName": "Da Nang",
            "ConChar": "DA",
            "Area": "4"
        },
        {
            "LocID": "651",
            "LocName": "Binh Phuoc",
            "ConChar": "BP",
            "Area": "6"
        },
        {
            "LocID": "711",
            "LocName": "Hau Giang",
            "ConChar": "HG",
            "Area": "7"
        },
        {
            "LocID": "780",
            "LocName": "Ca Mau",
            "ConChar": "CM",
            "Area": "7"
        },
        {
            "LocID": "781",
            "LocName": "Bac Lieu",
            "ConChar": "BL",
            "Area": "7"
        }
    ];
    return locs;
}

exports.statuses = statuses;
exports.placements = placements;
exports.sites = sites;
exports.platforms = platforms;