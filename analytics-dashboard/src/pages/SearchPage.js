import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import Search from '../components/SearchBox/index';

class SearchPage extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        dataSearch:[
            {
                video_title: "Trạch Thiên Ký",
                category: "Phim Bộ Nổi Bật",
                sumPlayView: 203996,
                sumImpression: 67803,
                sumTrueView: 31217,
                sumClick: 354,
                sumBooking: 1,
                revenueValue: 1989896
            },
            {
                video_title: "Thử Thách Thần Tượng",
                category: "TVShow Nổi Bật",
                sumPlayView: 136070,
                sumImpression: 54021,
                sumTrueView: 24788,
                sumClick: 286,
                sumBooking: 1,
                revenueValue: 1462391
            },
            {
                video_title: "Vua Hải Tặc",
                category: "Anime Nổi Bật",
                sumPlayView: 98711,
                sumImpression: 37550,
                sumTrueView: 20507,
                sumClick: 291,
                sumBooking: 1,
                revenueValue: 1256456
            }
        ]
    };
  }

  updateInput(value){
      //fetch data
      console.log(value)
  }

  render() {    
    const titlePage = Data.pages.map((page , index) => {
            if(page.id == 'VOD'){
            return <h2 key={index} style={globalStyles.titlePage}>{page.title}</h2>
            }
        });
    return (
        <Search dataSearch={this.state.dataSearch} update={this.updateInput}
        columns={[
                { key: 'video_title', name: 'Name' },
                { key: 'category', name: 'Category' },
                { key: 'sumPlayView', name: 'Playview' },
                { key: 'sumImpression', name: 'Impression phát sinh' },
                { key: 'sumTrueView', name: 'Trueview' },
                { key: 'sumClick', name: 'Click' },
                { key: 'revenueValue', name: 'Doanh thu ước tính' },
            ]} />
    )
  }
};
export default SearchPage
;