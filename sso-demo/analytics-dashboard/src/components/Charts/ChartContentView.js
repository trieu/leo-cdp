/**
 * Created by anhvt on 09/01/2017.
 */
 /*Phim xem  nhieu nhat*/
import React, {Component, PropTypes} from 'react';
import NVD3Chart from "react-nvd3";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
        this.state = {
            data: {},
            temp: {},
            widthChart: '100%',
            selectData: [],
            selected: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.dataSource();
    }

    componentWillReceiveProps(nextProps) {
        this.dataSource(nextProps);
    }

    handleChange(event, index, value){
        this.setState({selected: value});
        this.renderChart(value);
    }

    renderFilter(result){
        var selectData = [];
        for(var i in result){
            var arr = result[i];
            var rank = 0;
            for(var j in arr){
                rank = arr[j].rank;
            }
            selectData.push({id: rank, name: i});
        }

        this.setState({ selectData: selectData });
    }

    renderChart(rank, result){

        var result = result || this.state.temp;
        rank = rank || 0;
        var data = {};
        var values = [];
        var widthChart = 0;
        for(var i in result){
            var arr = result[i];
            if(i != 'VOD_FROM_MOBILE'){
                for(var j in arr){
                    if(rank == 0){
                        values.push({
                            label: arr[j].videoTitle,
                            value: arr[j].contentView
                        });
                    }
                    else if(rank == arr[j].rank){
                        widthChart = widthChart + 100;
                        values.push({
                            label: arr[j].videoTitle,
                            value: arr[j].contentView
                        });
                    }
                }
            }
        }

        data = [{
            key: "videoTitle",
            values: values
        }]

        widthChart = (widthChart == 0) ? "100%" : widthChart+'px';

        this.setState({ data: data , widthChart: widthChart});
        console.log(this.state.widthChart, this.state.data)
        this.setState({ show: false });
    }

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');
        var self = this;
        self.setState({ show: true });

        //get data for chart
        let url = 'https://360.adsplay.net/api/contentviewbycategory/report?startDate='+ beginDate +'&endDate='+ endDate +'&limit=10';
        axios.get(url)
        .then(function (response) {
            self.setState({ temp: response.data });
            self.renderFilter(response.data);
            self.renderChart(self.state.selected);
        })
        .catch(function (error) {
            console.log(error);
        });
 
    }

    widthChange(width){
        return {width: width};
    }

    render() {
        return (
            <div>
                <SelectField floatingLabelText="Frequency"
                    value={this.state.selected} 
                    onChange={this.handleChange}
                    >
                    <MenuItem key={0} value={0} primaryText="Tất cả" />
                    {this.state.selectData.map((item) =>
                        <MenuItem key={item.id} value={item.id} primaryText={item.name} />
                    )}
                </SelectField>

                <div style={this.widthChange(this.state.widthChart)}>
                    <NVD3Chart type="discreteBarChart"  datum={this.state.data} x="label" y="value"
                    height={400} margin={{bottom: 80}} showXAxis={false}
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}} />
                </div>
                
                <Loading show={this.state.show} />
            </div>
        );
    }
}


export default ChartContentView