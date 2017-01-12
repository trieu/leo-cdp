/**
 * Created by anhvt on 10/01/2017.
 */
/**
 * Created by anhvt on 09/01/2017.
 */
/**
 * Created by anhvt on 09/01/2017.
 */
import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


const {PropTypes} = React;

const data = [
    {name: 'Page A', pv: 2400},
    {name: 'Page B', pv: 1398},
    {name: 'Page C',  pv: 9800},
    {name: 'Page D',  pv: 3908},
    {name: 'Page E',  pv: 4800},
    {name: 'Page F',  pv: 3800},
    {name: 'Page G',  pv: 4300},
];


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
            console.log(result)
            var data = [];
            for(var i in result){
                var temp = result[i].videoTitle.match(/[A-Z]+/g);
                console.log(11111)
                console.log(typeof temp.toString());
                data.push({ name: result[i].videoTitle, pv: result[i].contentView, vt: result[i].videoCategory, temp: temp.toString()});
            }
            this.setState({ data: data });
            // console.log(111)
            // console.log(data)
        }.bind(this));

    }
    render () {
        return (
            <BarChart layout="vertical" className="fSize" width={1200} height={400} data={this.state.data}
                      margin={{top: 5, right: 30, left: 20, bottom: 5}} >
                <XAxis dataKey="temp" />
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip content={<CustomTooltip/>}/>
                {/*<Legend />*/}
                <Bar dataKey="pv" barSize={30} fill="#8884d8" />
            </BarChart>
        );
    }
}
const CustomTooltip  = React.createClass({
    propTypes: {
        type: PropTypes.string,
        payload: PropTypes.array,
        label: PropTypes.string,
        vt: PropTypes.string,
    },

    getIntroOfPage(label) {
        if (label === 'Page A') {
            return "Page A is about men's clothing";
        } else if (label === 'Page B') {
            return "Page B is about women's dress";
        } else if (label === 'Page C') {
            return "Page C is about women's bag";
        } else if (label === 'Page D') {
            return "Page D is about household goods";
        } else if (label === 'Page E') {
            return "Page E is about food";
        } else if (label === 'Page F') {
            return "Page F is about baby food";
        }
    },

    render() {
        const { active } = this.props;

        if (active) {
            const { payload, label } = this.props;
            // console.log(222222)
            console.log(payload)
            return (
                <div className="custom-tooltip">
                    <p className="label"  >{`${label} : ${payload[0].value}-${payload[0].payload.vt}`}</p>
                    {/*<p className="intro">{this.getIntroOfPage(label)}</p>*/}
                    {/*<p className="desc"></p>*/}
                </div>
            );
        }

        return null;
    }
});



export default ChartContentView