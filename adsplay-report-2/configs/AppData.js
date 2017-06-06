module.exports = {
  appName: "AdsPlay Report",
  UserName: "User",
  menus: [
    { text: 'Báo cáo tổng quát', icon: '<i class="pie chart icon"></i>', link: '/home' },
    { text: 'Báo cáo chi tiết', icon: '<i class="line chart icon"></i>', link: '/detail' },
    { text: 'Quản lý quảng cáo', icon: '<i class="area chart icon"></i>', link: '/ads' }
  ],
  pages: [
    { id: 'DashBoard', title: 'Xem báo cáo chi tiết Inventory quảng cáo' },
    { id: 'VOD', title: 'Xem doanh thu quảng cáo từ VOD' },
    { id: 'ADS', title: 'Quản lý quảng cáo' }
  ]
};