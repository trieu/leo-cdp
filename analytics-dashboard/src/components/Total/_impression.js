import React, {Component, PropTypes} from 'react';
import globalStyles from '../../styles';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchTotalImpression } from './_Action';

class TotalImpression extends React.Component{

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

        this.props.fetchTotalImpression(props.sourceMedia, beginDate, endDate);
    }

    render() {
        return (
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Impression</span>

                    <div style={globalStyles.clear}/>

                    <span style={globalStyles.title}>{this.props.data}</span>
                </Paper>
            </div>
        )
    }


}

function mapStateToProps(state) {
  return { data: state.totals.total_impression };
}

export default connect(mapStateToProps, { fetchTotalImpression })(TotalImpression);
