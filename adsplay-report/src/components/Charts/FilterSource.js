import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class FilterSource extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.sourceMedia || "danet-mienphi"
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value){
        this.setState({selected: value});
        this.props.update(value);
    }

    render(){
        return (
             <SelectField floatingLabelText="Đối tác nội dung"
                    disabled={this.props.disabled}
                    fullWidth={true}
                    value={this.state.selected} 
                    onChange={this.handleChange}
                    >
                    <MenuItem key={0} value={"all"} primaryText="Tất cả" />
                    <MenuItem key={1} value={"danet-mienphi"} primaryText="Danet" />
            </SelectField>
        )
    }
}

export default FilterSource;
