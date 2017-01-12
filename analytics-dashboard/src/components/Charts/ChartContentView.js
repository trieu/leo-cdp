/**
 * Created by anhvt on 09/01/2017.
 */
/**
 * Created by anhvt on 09/01/2017.
 */
import React from 'react';
import {CustomBarLabel,ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


const {PropTypes} = React;
// const {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
const data = [{name: 'Page A', pv: 800},
    {name: 'Page B',  pv: 967, amt:2000},
    {name: 'Page C', pv: 1098, amt:1000},
    {name: 'Page D', pv: 1200, amt:1000},
    {name: 'Page E', pv: 1108, amt:1000},
    {name: 'Page F', pv: 680, amt:1000}];


class ChartContentView extends React.Component {
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
    componentWillReceiveProps(nextProps){
      this.dataSource(nextProps);
    }
    dataSource(props){
        props = props || this.props;
        return $.ajax({
            type: "get",
            dataType: 'json',
            url: 'https://360.adsplay.net/api/contentview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
        }).done(function(result){

            var data = [];
            for(var i in result){

                data.push({ name: result[i].videoTitle, pv: result[i].contentView,vc: result[i].videoCategory });
            }
            this.setState({ data: data });
            // console.log(111)
            // console.log(data)
        }.bind(this));

    }
    render () {
        return (
            <ComposedChart layout="vertical" width={1200} height={400} data={this.state.data}
                           margin={{top: 20, right: 20, bottom: 20, left: 200}}>
                <XAxis dataKey="pv" type="number" />
                <YAxis dataKey="vc" type="category" allowDataOverflow={false} tickSize={10} tickLine={false} minTickGap={15} tick={true} tickCount={3} />

                <Tooltip />
                {/*<Legend/>*/}
                <CartesianGrid stroke='#f5f5f5'/>
                <Area dataKey='amt' fill='#8884d8' stroke='#8884d8'/>
                <Bar dataKey='pv' barSize={20} fill='#413ea0'   />
                <Line dataKey='uv' stroke='#ff7300'/>
            </ComposedChart>
        );
    }
}




export default ChartContentView