import React from 'react';
import ReactDOM from 'react-dom';

export default class Search extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

        
    getData(){
        return this.refs.Select.value;
    }

    renderElement(props){
        var options = props.options || {};
        if(!this.select){
            this.select = $('select.dropdown').dropdown(options);
        }
    }

    renderItem(data){
        if(data.length <= 0){
            return (
                <option value="">No data</option>
            )
        }

        return data.map((item, key) => {
            return(
                <option value={item.key} key={key}>{item.value}</option>
            )
        });
    }


    render() {
        return (
            <select ref="Select" className="ui dropdown">
                {this.renderItem(this.props.data)}
            </select>
        );
    }
}