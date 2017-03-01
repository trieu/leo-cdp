/**
 * Created by anhvt on 09/01/2017.
 */
 /*Phim xem  nhieu nhat*/
import React, {Component, PropTypes} from 'react';
import Chart from 'chart.js';
import RC2 from 'react-chartjs2';
import axios from "axios";
import moment from 'moment';
import Loading from '../Loading/LoadingPager';


const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d','#a4de6c',
    '#d0ed57', '#FABFA1', '#B86A54', '#FE8A71', '#DC626F',
    '#FE6860', '#F3C9BF', '#C9C7AF', '#93BFB6', '#7CA39C',
    '#726680', '#779BF0', '#849FBB', '#C2B6D6', '#EBE1E2'];

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
        }
    ]
};


class ChartContentView extends Component {
    constructor(props) {
        super(props);
        this.state = {data: {}}
    }

    componentWillMount() {
        this.dataSource();
    }

    componentWillReceiveProps(nextProps) {
        this.dataSource(nextProps);
    }

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');
        let url = 'https://360.adsplay.net/api/contentview/report?startDate='+ beginDate +
        '&endDate='+ endDate + '&limit=11';


        var seft = this;
        seft.setState({ show: true });

        axios.get(url)
        .then(function (response) {
            var result = response.data;
            var data = {};
            var videoTitle = [];
            var contentView = [];
            for(var i in result){
                if(result[i].videoCategory != 'VOD_FROM_MOBILE'){
                    videoTitle.push(result[i].videoTitle);
                    contentView.push(result[i].contentView);
                }
            }
            data = {
                labels: videoTitle,
                datasets: [
                    {
                        label: 'View',
                        backgroundColor: "#83a6ed",
                        borderColor: "#83a6ed",
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: contentView,
                    }
                ]
            };

            seft.setState({ data: data });
            seft.setState({ show: false });
        })
        .catch(function (error) {
            console.log(error);
        });
 
    }
    render() {
        return (
            <div>
                <RC2 height={80}
                    data={this.state.data} type='horizontalBar' 
                        options={{
                            tooltips: {
                                enabled: true,
                                callbacks: {
                                    label: function(tooltipItems, data) { 
                                        return tooltipItems.xLabel.toLocaleString();
                                    }
                                }
                        
                            }
                        }}
                         />
                <Loading show={this.state.show} />
            </div>
        );
    }
}


export default ChartContentView