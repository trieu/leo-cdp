/*The loai phim*/
import React, {Component, PropTypes} from 'react';
import NVD3Chart from "react-nvd3";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import Loading from '../Loading/LoadingPager';

import { connect } from 'react-redux';
import { fetchTopCategory } from './_Action';

class ChartTopCategory extends React.Component{

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
        this.dataSource = this.dataSource.bind(this);
    }


    componentWillMount() {
        this.dataSource();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceMedia != nextProps.sourceMedia
         || this.props.beginDate != nextProps.beginDate
         || this.props.endDate != nextProps.endDate){
            this.dataSource(nextProps);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        
        if(this.props.data != nextProps.data){
            this.setState({ temp: nextProps.data });
            this.renderFilter(nextProps.data);
            this.renderChart(this.state.selected, nextProps.data);
        }
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
            if(i != 'VOD_FROM_MOBILE'){
                for(var j in arr){
                    rank = arr[j].rank;
                }
                selectData.push({id: rank, name: i});
            }
        }

        var dataASC = _.orderBy(selectData, ['name'], ['asc']);
        this.setState({ selectData: dataASC });
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
        }];

        widthChart = (widthChart == 0) ? "100%" : widthChart+'px';

        this.setState({ data: data , widthChart: widthChart});
        
        this.setState({ show: false });
    }

    dataSource(props){
        var self = this;

        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        this.props.fetchTopCategory(props.sourceMedia, beginDate, endDate);
    }

    widthChange(width){
        return {width: "100%", maxWidth: width};
    }

    render() {
        return (
            <div>
                <SelectField floatingLabelText="Thể loại"
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
                
                <Loading show={this.props.loading} />
            </div>
        );
    }


}

function mapStateToProps(state) {
  return { data: state.charts.topcategory, loading: state.charts.loading_topcategory };
}

export default connect(mapStateToProps, { fetchTopCategory })(ChartTopCategory);
