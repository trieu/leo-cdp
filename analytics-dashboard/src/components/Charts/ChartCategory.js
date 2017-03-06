/*The loai phim*/
import React, {Component, PropTypes} from 'react';
import {Pie} from 'react-chartjs2';
import NVD3Chart from "react-nvd3";
import d3 from "d3";
import axios from "axios";
import moment from 'moment';
import Loading from '../Loading/LoadingPager';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d','#a4de6c',
    '#d0ed57', '#FABFA1', '#B86A54', '#FE8A71', '#DC626F',
    '#FE6860', '#F3C9BF', '#C9C7AF', '#93BFB6', '#7CA39C',
    '#726680', '#779BF0', '#849FBB', '#C2B6D6', '#EBE1E2'];


const data = [
    {key: "Eight", y: 6},
    {key: "Nine", y: 2},
    {key: "Ten", y: 11},
];
 
class ChartCategory extends React.Component{

    constructor(props) {
        super(props);
        this.state = { data: [] , show: false };
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

        //custom role
        var nameMedia = "";
        var bySource = ""
        if(props.sourceMedia != "all"){
            nameMedia = "bysource";
            bySource = "&source=" + props.sourceMedia;
        }
        let url = 'https://360.adsplay.net/api/categoryview'+nameMedia+'/report?startDate='+ beginDate + '&endDate='+ endDate + '&limit=10' + bySource;

        var seft = this;
        seft.setState({ show: true });

        axios.get(url)
        .then(function (response) {
            var result = response.data;
            var data = [];
            for(var i in result){
                if(result[i].category != 'VOD_FROM_MOBILE'){
                    data.push({
                        key:result[i].category,
                        y:result[i].contentView,
                        color:COLORS[i]
                    });
                }
            }

            seft.setState({ data: data });
            seft.setState({ show: false });
        })
        .catch(function (error) {
            console.log(error);
        });

    }

        // function configure(chart) {
        //   // chart.tooltip.keyFormatter( function(d){ return d3.format(',f')(d) });
        //   chart.pie.valueFormat(d3.format(',.0d'));
        //   // chart.legend.key(someOtherFn);
        // }

    render() {

        return (
            <div>
                <NVD3Chart
                    id="chart"
                    width="600"
                    height="470"
                    type="pieChart"
                    datum={this.state.data}
                    x="key"
                    y="y"
                    donut="true"
                    donutRatio="0.3"
                    labelThreshold=".05"
                    labelType="percent"
                    showTooltipPercent="true"
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}}
                />
                <Loading show={this.state.show} />
            </div>
        )
    }


}
export default ChartCategory;
