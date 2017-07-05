module.exports = {
    HOST: '127.0.0.1',
    PORT: '9881',
    SALT: '$6*7&8^9mvc@#!AI',
	SESSION: 1000*60*60*24*2, //2 day
	VERSION: '20170507',
	META: {
		AUTHOR: 'xemgiday.com',
		TITLE: 'Tin tức hót nhất mạng xã hội',
		DESCRIPTION: 'Dành cho những bạn chán Facebook, chán YouTube, chán TV và không biết xem gì đây!',
		KEYWORD: 'xu hướng,tìm kiếm,giải trí,tin tức,thể thao,ăn uống,địa điểm,du lịch,dịch vụ,phim hay',
		IMAGE: 'public/img/logo.jpg',
	},
	API: {
		PAGE: 'http://fastdataapi.adsplay.net/analytics/fb_pages',
	},
	SSO: 'http://id.adsplay.net/',
};