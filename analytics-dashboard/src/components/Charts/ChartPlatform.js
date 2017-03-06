/*Thiet bi*/
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

class ChartPlatform extends React.Component{

    constructor(props) {
        super(props);
        this.state = {data: [], sum: 0}
    }

    componentWillMount() {
        this.dataSource();
    } 

    componentWillReceiveProps(nextProps) {
        this.dataSource(nextProps);
    }

    componentWillUpdate(nextProps, nextState) {
        
        if(this.state.sum != nextState.sum){
            this.props.getSum(nextState.sum);
        }
    }

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        var nameMedia = "";
        var bySource = ""
        if(props.sourceMedia != "all"){
            nameMedia = "bysource";
            bySource = "&source=" + props.sourceMedia;
        }

        let url = 'https://360.adsplay.net/api/platformview'+nameMedia+'/report?startDate='+ beginDate +
        '&endDate='+ endDate + '&limit=10' + bySource;

        var self = this;
        self.setState({ show: true });

        axios.get(url)
        .then(function (response) {
            var result = response.data;
            var data = [];
            var videoTitle = [];
            var contentView = [];
            var sum = 0;
            for(var i in result){
                sum += parseInt(result[i].contentView);
                data.push({
                    key:result[i].platformName,
                    y:result[i].contentView,
                    color:COLORS[i]

                })
            }

            self.setState({ data: data});
            self.setState({ sum: sum});

            self.setState({ show: false });
        })
        .catch(function (error) {
            console.log(error);
        });

    }


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
export default ChartPlatform;
