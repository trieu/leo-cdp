/*The loai phim*/
import React, {Component, PropTypes} from 'react';
import NVD3Chart from "react-nvd3";
import moment from 'moment';
import Loading from '../Loading/LoadingPager';
import _ from "lodash";

import { connect } from 'react-redux';
import { fetchCategory } from './_Action';

class ChartCategory extends React.Component{

    constructor(props) {
        super(props);
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

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        this.props.fetchCategory(props.sourceMedia, beginDate, endDate);
    }

    render() {
        return (
            <div>
                <NVD3Chart
                    id="chart"
                    width={600}
                    height={470}
                    type="pieChart"
                    datum={this.props.data}
                    x="key"
                    y="value"
                    donut="true"
                    donutRatio="0.3"
                    labelThreshold=".05"
                    labelType="percent"
                    showTooltipPercent="true"
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}}
                />
                <Loading show={this.props.loading} />
            </div>
        )
    }


}

function mapStateToProps(state) {
  return { data: state.charts.category, loading: state.charts.loading_category };
}

export default connect(mapStateToProps, { fetchCategory })(ChartCategory);
