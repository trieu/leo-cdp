import React, {Component, PropTypes} from 'react';
import globalStyles from '../../styles';
import Paper from 'material-ui/Paper';

class SummaryChartPlatform extends React.Component{

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total playview</span>

                    <div style={globalStyles.clear}/>
                    
                    <span style={globalStyles.title}>{this.props.value}</span>
                </Paper>
            </div>
        )
    }


}
export default SummaryChartPlatform;
