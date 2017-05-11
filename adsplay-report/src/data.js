import React from 'react';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Web from 'material-ui/svg-icons/av/web';
import {cyan600, pink600, purple600} from 'material-ui/styles/colors';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

const data = {
  appTitle: "Adsplay Report",
  profileName: "Admin",
  menus: [
    { text: 'Báo cáo tổng quát', icon: <Assessment/>, link: '/dashboard' },
    { text: 'Báo cáo chi tiết', icon: <Web/>, link: '/detail' }
  ],
  pages: [
    { id: 'DashBoard', title: 'Xem báo cáo chi tiết Inventory quảng cáo' },
    { id: 'VOD', title: 'Xem doanh thu quảng cáo từ VOD' }
  ]
};

export default data;
