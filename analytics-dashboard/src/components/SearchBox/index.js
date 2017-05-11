import React, {Component} from 'react';
import SearchResult from './SearchResult'
import _ from 'lodash';

class Search extends Component {

  constructor(props) {
    super(props);

    this.handleChange = _.debounce(this.handleChange.bind(this), 500);
  }

  handleChange(){
    let val = this.inputTitle.value;
    this.props.update(val);
  };

  render() {
    const style = {
      int: {
        position: 'relative',
        width: '100%',
        fontSize: '16px',
        lineHeight: '24px',
        height: '48px',
        display: 'inline-block',
        backgroundColor: 'transparent',
        fontFamily: 'Roboto, sans-serif',
        cursor: 'auto',
        border: '1px solid rgb(218, 218, 218)',
        padding: '0px 100px 0px 1em',
        boxSizing: 'border-box'
      }
    };
    return (
        <div style={{position: 'relative'}}>
            <input type="text" style={style.int} placeholder="Search" ref={el => this.inputTitle = el} onChange={this.handleChange} />
            <SearchResult data={this.props.data}
            columns={this.props.columns}
            loading={this.props.loading}
            />
        </div>
    );
  }
}

export default Search;