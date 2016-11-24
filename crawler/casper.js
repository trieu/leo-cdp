var useragent = [
'Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50',
'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36',
'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16',
'Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14',
'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17'
];

var fs = require('fs');
var casper = require('casper').create({
	proxy: "112.214.73.253",
	pageSettings: {
		userAgent: useragent[Math.floor(Math.random() * useragent.length)],
		javascriptEnabled: true
	},
});


casper.start('about:blank');

//var urls = ['http://example.com','http://emptys.com/'];
var urls = [
      { "loc": "http://kingdoor.com.vn/" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-kingdoor-bid1.html" },
      { "loc": "http://kingdoor.com.vn/sanpham.html" },
      { "loc": "http://kingdoor.com.vn/lienhe.html" },
      { "loc": "http://kingdoor.com.vn/huong-dan-dat-hang-bid3.html" },
      { "loc": "http://kingdoor.com.vn/form1.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-d10.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-veneer-d11.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-d12.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-d13.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-abs-han-quoc-d14.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-chong-chay-d15.html" },
      { "loc": "http://kingdoor.com.vn/cua-thep-chong-chay-d16.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-loi-thep-upvc-d17.html" },
      { "loc": "http://kingdoor.com.vn/cua-thoat-hiem-d39.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-ydoor-d18.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cach-am-d43.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-mdf-melamine-d19.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-mdf-laminate-d20.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-nha-ve-sinh-d21.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-d34.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-go-sungyu-d32.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-tu-nhien-d33.html" },
      { "loc": "http://kingdoor.com.vn/tay-vin-cau-thang-go-d37.html" },
      { "loc": "http://kingdoor.com.vn/noi-tha-go-d22.html" },
      { "loc": "http://kingdoor.com.vn/phu-kien-cua-d23.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-d41.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-go-d40.html" },
      { "loc": "http://kingdoor.com.vn/da-go-cong-nghiep-d38.html" },
      { "loc": "http://kingdoor.com.vn/mau-cua-nhua-dep-d36.html" },
      { "loc": "http://kingdoor.com.vn/mau-cua-go-dep-d35.html" },
      { "loc": "http://kingdoor.com.vn/sanpham.html?banchay=1" },
      { "loc": "http://kingdoor.com.vn/tay-day-hoi-newstart-cui-cho-hoi-id73.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-sungyu-id72.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-go-sungyu-id71.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-tu-nhien-id70.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-soi-cua-4-canh-id69.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cam-xe-cua-go-tu-nhien-id68.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-go-cua-nhua-sungyu-id67.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-laminate-boc-inox-id66.html" },
      { "loc": "http://kingdoor.com.vn/cua-laminate-truong-sa-id65.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-laminate-cua-go-cong-nghiep-laminate-id64.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-melamine-id63.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-melamine-id62.html" },
      { "loc": "http://kingdoor.com.vn/cua-mdf-melamine-id61.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-van-go-ydoor-id60.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-ydoor-id59.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-cua-nhua-ydoor-cua-nhua-cao-cap-door-id58.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-ydoor-id57.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-tu-nhien-cam-xe-id56.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-go-sungyu-id55.html" },
      { "loc": "http://kingdoor.com.vn/da-go-cong-nghiep-hdf-id54.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-xep-id53.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-loi-thep-id52.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-malaysia-id51.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-dai-loan-id50.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-nhua-abs-han-quoc-id49.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-go-chong-chay-id48.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-go-cong-nghiep-hdf-id47.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-go-soi-id46.html" },
      { "loc": "http://kingdoor.com.vn/gia-cua-go-id45.html" },
      { "loc": "http://kingdoor.com.vn/cua-cach-am-phong-thu-id44.html" },
      { "loc": "http://kingdoor.com.vn/khuyen-mai-nhan-dip-khai-truong-bid4.html" },
      { "loc": "http://kingdoor.com.vn/thanh-toan-giao-hang-bid2.html" },
      { "loc": "http://kingdoor.com.vn/gioi-thieu-b1.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-id19.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-id18.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-id17.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-id16.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdfveneer-id22.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdfveneer-id21.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdfveneer-id20.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-id2.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-id25.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-id24.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-id23.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-veneer-id3.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-dai-loan-id28.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-id27.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-abs-han-quoc-id31.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-abs-han-quoc-id30.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-abs-han-quoc-id29.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-abs-han-quoc-id5.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-chong-chay-60-phut-id34.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-chong-chay-90-phut-id33.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-chong-chay-120-phut-id32.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-chong-chay-id6.html" },
      { "loc": "http://kingdoor.com.vn/cua-thep-chong-chay-120-phut-id37.html" },
      { "loc": "http://kingdoor.com.vn/cua-thep-chong-chay-90-phut-id36.html" },
      { "loc": "http://kingdoor.com.vn/cua-theo-chong-chay-60-phut-id35.html" },
      { "loc": "http://kingdoor.com.vn/cua-thep-chong-chay-id7.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-loi-thep-id40.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-upvc-id39.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-loi-thep-id8.html" },
      { "loc": "http://kingdoor.com.vn/cua-cach-am-phong-karaoke-id43.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-phong-karaoke-id42.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cach-am-id41.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-melamine-id10.html" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-mdf-laminate-id11.html" },
      { "loc": "http://kingdoor.com.vn/chan-cua-ban-nguyet-d42.html" },
      { "loc": "http://kingdoor.com.vn/cuc-hit-chan-cua-d31.html" },
      { "loc": "http://kingdoor.com.vn/tay-day-hoi-d30.html" },
      { "loc": "http://kingdoor.com.vn/thanh-thoat-hiem-d29.html" },
      { "loc": "http://kingdoor.com.vn/o-khoa-cua-d24.html" },
      { "loc": "http://kingdoor.com.vn/thanh-thoat-hiem-id15.html" },
      { "loc": "http://kingdoor.com.vn/cuc-hit-chan-cua-id14.html" },
      { "loc": "http://kingdoor.com.vn/khoa-tron-tay-gat-vickyni-id13.html" },
      { "loc": "http://kingdoor.com.vn/ke-bep-go-d25.html" },
      { "loc": "http://kingdoor.com.vn/tu-quan-ao-tu-am-tuong-d28.html" },
      { "loc": "http://kingdoor.com.vn/sanpham.html?p" },
      { "loc": "http://kingdoor.com.vn/sanpham.html?p=2" },
      { "loc": "http://kingdoor.com.vn/modules/upload/upload_form1.php" },
      { "loc": "http://kingdoor.com.vn/cua-go-cong-nghiep-hdf-id1.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-cao-cap-id26.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-gia-go-id4.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-ydoor-id9.html" },
      { "loc": "http://kingdoor.com.vn/cua-nhua-nha-ve-sinh-id12.html" },
      { "loc": "http://kingdoor.com.vn/vach-ngan-trang-tri-bang-go-d27.html" },
      { "loc": "http://kingdoor.com.vn/quay-ba-go-d26.html" },
      { "loc": "http://kingdoor.com.vn/dangnhap.html" },
      { "loc": "http://kingdoor.com.vn/gianhang_quenmatkhau.php" },
      { "loc": "http://kingdoor.com.vn/dangky.html" }
    ];

var fs = require('fs');
var word = [];
casper.each(urls, function(casper, link) {
	var url = link.loc;
	if(url.indexOf("-id") != -1){
		var strUrl = url.split('-');
		var last = strUrl[strUrl.length-1];
		var id = last.replace(/(id|.html)/gi, "");
		casper.thenOpen(url, function() {

			this.waitForSelector('meta', function() {
				// this.captureSelector('weather.png', 'h1');
				var img = this.getElementAttribute('meta[property="og:image"]', 'content');
				var imgLocal = './img/door-'+id+'.jpg';
				this.download(img, imgLocal);
				var obj = {
					id: id,
					title: this.getElementInfo('title').text,
					name: this.getElementInfo('label[itemprop="name"] a').text,
					content: this.getElementInfo('#tab0').html,
					image: imgLocal
				};
				word.push(obj);

			});
		});
	}

});

casper.run(function(){
	fs.write('./json/data.json', JSON.stringify(word), 'w');
	this.exit();
});