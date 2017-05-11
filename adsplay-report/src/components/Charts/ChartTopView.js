/*The loai phim*/
import React, {Component, PropTypes} from 'react';
import RC2 from 'react-chartjs2';
import d3 from "d3";
import moment from 'moment';
import Loading from '../Loading/LoadingPager';

import { connect } from 'react-redux';
import { fetchTopView } from './_Action';

class ChartTopView extends React.Component{

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

        this.props.fetchTopView(props.sourceMedia, beginDate, endDate);

    }

    render() {
        return (
            <div>
                <RC2 height={80}
                    data={this.props.data} type='horizontalBar' 
                        options={{
                            tooltips: {
                                enabled: true,
                                callbacks: {
                                    label: function(tooltipItems, data) { 
                                        return tooltipItems.xLabel.toLocaleString();
                                    }
                                }
                        
                            }
                        }}
                         />
                <Loading show={this.props.loading} />
            </div>
        )
    }


}

function mapStateToProps(state) {
  return { data: state.charts.topview, loading: state.charts.loading_topview };
}

export default connect(mapStateToProps, { fetchTopView })(ChartTopView);
