/**
 * Created by trieu on 5/2/16.
 */

exports.removeCharacters = function (value){
    var s = value;
    s= s.toLowerCase();
    s= s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    s= s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    s= s.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    s= s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    s= s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    s= s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    s= s.replace(/đ/g,"d");

    s= s.replace(/\s+/gi,"-");
    s= s.replace(/^\-+|\-+$/g,"");
    return s;
};

exports.formatCurrency = function (value) { 
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

exports.json = function (value) { return JSON.stringify(value) };

exports.isNull = function (value) {
    if (typeof value !== "undefined" && value !== null){ 
        return false;
    }
    return true;
};

