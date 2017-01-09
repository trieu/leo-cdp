import React from 'react';

import { PieChart, Pie, Sector, Cell , Tooltip } from 'recharts';

const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
    {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`ContentView ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

class ChartPlatform extends React.Component{
    constructor(props) {
        // Pass props to parent class
        super(props);
        // Set initial state
        this.state = {activeIndex: 0}
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
            url: 'https://360.adsplay.net/api/platformview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00',
        }).done(function(result){
            var data = [];
            for(var i in result){
                data.push({ name: result[i].platformName, value: result[i].contentView });
            }
            this.setState({ data: data });
        }.bind(this));
    }
    onPieEnter(data, index) {
        this.setState({
            activeIndex: index,
        });
    }
    render () {
        return (
            <PieChart width={600} height={400} onMouseEnter={this.onPieEnter.bind(this)}>
                <Pie
                    activeIndex={this.state.activeIndex}
                    activeShape={renderActiveShape}
                    data={this.state.data}
                    cx={300}
                    cy={200}
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"/>
            </PieChart>
        );
    }
}
export default ChartPlatform;
