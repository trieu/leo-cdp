var fs = require('fs.extra');
// ______________________ helper ______________________ 
var removeUnicodeSpace = function (str){
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

var newFolder = function(name){
    //create folder
    if (!fs.existsSync(name)){
        fs.mkdirSync(name); 
    }
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var youtubeValid = function(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

var getNamePath = function (temp){
    if(youtubeValid(temp) == false){
        var str = temp.split("/");
        var name = str[str.length-1];
        return name;
    }
    return temp;
}

module.exports = {
    removeUnicodeSpace: removeUnicodeSpace,
    newFolder: newFolder,
    deleteFolderRecursive: deleteFolderRecursive,
    youtubeValid: youtubeValid,
    getNamePath: getNamePath
}