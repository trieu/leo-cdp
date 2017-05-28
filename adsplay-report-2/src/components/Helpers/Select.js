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

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.selectDefault){
            console.log(ReactDOM.findDOMNode(this).value = prevProps.selectDefault)
            ReactDOM.findDOMNode(this).value = prevProps.selectDefault;
        }
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
        $(ReactDOM.findDOMNode(this)).dropdown();
        console.log(1)
    }

    renderItem(data, removeNoData){

        if(data.length <= 0){
            return (
                <option value="-1">No data</option>
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