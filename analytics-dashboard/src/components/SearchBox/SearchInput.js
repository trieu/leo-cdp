import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
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
        <div style={{position: 'relative'}}>
        <AutoComplete
          hintText="Nhập từ bạn muốn tìm ..."
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleChange}
          fullWidth={true}
          textFieldStyle={{border: "1px solid #dadada", padding: "0 100px 0 1em", boxSizing: "border-box"}}
          underlineShow={false}
        />
        <FlatButton
          backgroundColor="#1e88e5"
          hoverColor="#1e75e5"
          icon={<i className="fa fa-search" style={{color: "#fff"}} />}
          style={{position: 'absolute', top:0, right:0, fontSize: '20px', height: '48px', lineHeight: '48px'}}
        />
        </div>
    );
  }
}

export default SearchBox;