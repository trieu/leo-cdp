import React from 'react';
import ReactDOM from 'react-dom';

export default class Search extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || [],
        }
    }
    
    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    getData(){
        return this.refs.Select.value;
    }

    handleChange(){
        console.log(this.getData())
        this.props.onChange(this.getData());
    }

    renderElement(props){
        var options = props.options || {};
        this.setState({data: props.data});
        $('select.dropdown').dropdown(options);
    }

    renderItem(data, removeNoData){

        if(data.length <= 0){
            if(removeNoData){
                return;
            }
            return (
                <option value="no_data">No data</option>
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
            <select ref="Select" className="ui dropdown" onChange={this.handleChange.bind(this)}>
                {this.renderItem(this.state.data, this.props.removeNoData || false)}
            </select>
        );
    }
}