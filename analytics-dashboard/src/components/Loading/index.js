import React, {Component, PropTypes} from 'react';

class Loading extends React.Component{
    constructor(props) {
        super(props);

        const { show , ...options } = this.props;
    }

    handleChangeBegin(event, date){
        this.setState({
            beginDate: date
        });
    }

    handleChangeEnd(event, date){
        this.setState({
            endDate: date
        });
    }

    handleChange() {
        this.props.update(this.state.beginDate, this.state.endDate);
    }

    render() {

        return (
            
        );
    };
}


export default ChartFilter;