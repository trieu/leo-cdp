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
        console.log(props.data.length, "<<")
        if(props.data.length > 0){
            console.log(props.data.length)
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
            <table ref="Table" className="ui celled unstackable table" width="100%">
                <thead>
                    <tr>
                        {this.renderLabel(this.props.label || [])}
                    </tr>
                </thead>
                <tbody>
                    {this.renderItem(this.props.data || [])}
                </tbody>
            </table>
        );
    }
}