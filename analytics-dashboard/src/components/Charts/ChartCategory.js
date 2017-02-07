
import React, {Component, PropTypes} from 'react';
import {Pie} from 'react-chartjs2';
import NVD3Chart from "react-nvd3";
import d3 from "d3";

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

        // Pass props to parent class
        super(props);
        // Set initial state
        this.state = {data: []}
        // this.apiUrl = 'https://360.adsplay.net/api/platformview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00'
    }

    componentWillMount() {
        this.dataSource();

    }

    dataSource(props){
        props = props || this.props;
        return $.ajax({
            type: "get",
            dataType: 'json',
            url: 'https://360.adsplay.net/api/categoryview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
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
                    renderEnd={function(chart, e){console.log( chart.id(), e)}}
                    renderStart={function(chart, e){console.log( chart.id(), e)}}
                    ready={function(chart, e){console.log( chart.id(), e)}}
                />
            </div>
        )
    }


}
export default ChartCategory;
