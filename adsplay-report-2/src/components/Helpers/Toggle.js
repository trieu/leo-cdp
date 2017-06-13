import React from 'react';
import ReactDOM from 'react-dom';

export default class Toggle extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            label: this.props.label || ""
        }
    }

    componentDidMount(){
        if(this.props.toggleLabel){
            this.setState({label: this.props.checked ? this.props.toggleLabel[0] : this.props.toggleLabel[1]})
        }
    }

    handleChange(e){
        if(this.props.onChange){
            if(this.props.toggleLabel){
                this.setState({label: e.target.checked ? this.props.toggleLabel[0] : this.props.toggleLabel[1]})
            }
            
            this.props.onChange(e.target.value, e.target.checked);
        }
    }

    render() {
        const {value, toggleLabel, checked} = this.props;
        return (
            <div className="ui toggle checkbox">
                <input ref="Toggle" type="checkbox" value={value} defaultChecked={checked} onChange={this.handleChange.bind(this)} />
                <label>{this.state.label}</label>
            </div>
        );
    }
}