import React from 'react';
import ReactDOM from 'react-dom';

export default class Search extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || [],
        }
    }
    
    componentDidMount() {
        this.renderElement(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.renderElement(newProps);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log(prevProps.data != this.props.data)
    //     $(ReactDOM.findDOMNode(this)).dropdown({
    //         fullTextSearch: true,
    //         sortSelect: true
    //     });
    // }

    getData(){
        return this.refs.Select.value;
    }

    handleChange(){
        if(this.props.onChange){
            this.props.onChange(this.getData());
        }
    }

    renderElement(props){
        this.setState({data: props.data});
        var data = props.data || {};
        if(!this.Select){
            this.Select = $('select.dropdown').dropdown({
                fullTextSearch: true,
                sortSelect: true
            });
        }
    }

    renderItem(data){
        if(data.length <= 0){
            return (
                <option value="-1">{(this.props.placeHolder) ? this.props.placeHolder : "No data"}</option>
            )
        }

        return data.map((item, key) => {
            return(
                <option value={item.key} key={key} disabled={item.disabled}>{item.value}</option>
            )
        });
    }


    render() {
        return (
            <select ref="Select" className="ui dropdown search" onChange={this.handleChange.bind(this)}>
                {this.renderItem(this.state.data)}
            </select>
        );
    }
}