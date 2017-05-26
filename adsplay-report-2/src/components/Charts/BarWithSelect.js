import React from 'react';
import ReactDOM from 'react-dom';
import Bar from './Bar';
import Select from '../Helpers/Select';

export default class BarWithSelect extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    renderElement(props){

    }

    render() {
        return (
            <div className="ui form">
                    <div className="field">
                        <label>Đối tác nội dung</label>
                        <Select
                            ref={instance => { this.chartData = instance; }}
                            data={this.state.selectData}
                        />
                    </div>
                </div>
        );
    }
}