import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';

/**
 * The input is used to create the `dataSource`, so the input always matches three entries.
 */
class SearchBox extends Component {

  constructor(props) {
      super(props);
      this.state = {
        dataSource: [],
      };
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value){
    this.setState({
      dataSource: [
        value,
        value + value,
        value + value + value,
      ],
    });
  };

  render() {
    return (
        <AutoComplete
          hintText="Nhập từ bạn muốn tìm ..."
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleChange}
          fullWidth={true}
          textFieldStyle={{background: "#333"}}
          disableFocusRipple={false}
        />
    );
  }
}

export default SearchBox;