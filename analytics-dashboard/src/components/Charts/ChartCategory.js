import React, {Component, PropTypes} from 'react';
import {Pie} from 'react-chartjs2';
import NVD3Chart from "react-nvd3";
import d3 from "d3";
import moment from 'moment';

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
        this.state = { data: []};
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
        let url = 'https://360.adsplay.net/api/categoryview/report?startDate='+ beginDate +
        '&endDate='+ endDate + '&limit=10';

        return $.ajax({
            type: "get",
            dataType: 'json',
            url: url,
        }).done(function(result){
            console.log(result)
            var data = [];
            for(var i in result){
                data.push({
                    key:result[i].category,
                    y:result[i].contentView,
                    color:COLORS[i]

                })
            }

            this.setState({ data: data });

        }.bind(this));

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
                    donut="true"
                    donutRatio="0.3"
                    labelType="percent"
                    showTooltipPercent="true"
                />
            </div>
        )
    }


}
export default ChartCategory;
