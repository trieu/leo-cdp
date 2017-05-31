import React from 'react';
import ReactDOM from 'react-dom';

export default class Table extends React.Component {

    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    renderElement(props){
        var options = props.options || {};
        if(!this.DataTable){
            this.DataTable = $(ReactDOM.findDOMNode(this)).DataTable(options);
        }
        
    }

    renderItem(data){
        if(data.length <= 0){
            return;
        }

        return data.map((item, key) => {
            var row = item.map((cell, k) => <td key={k}>{cell}</td>); 
            return(
                <tr key={key}>{row}</tr>
            )
        });
    }

    renderLabel(data){
        if(data.length <= 0){
            return;
        }

        return data.map((item, key) => {
            return(
                <th key={key}>{item}</th>
            )
        });
    }

    render() {
        return (
            <table ref="Table" className="ui celled table" width="100%">
                <thead>
                    <tr>
                        {this.renderLabel(this.props.data.label || [])}
                    </tr>
                </thead>
                <tbody>
                    {this.renderItem(this.props.data.data || [])}
                </tbody>
            </table>
        );
    }
}