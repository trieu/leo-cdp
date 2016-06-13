/**
 * Created by trieu on 5/2/16.
 */


exports.removeUnicodeSpace = function (str){
    var s = str;
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