import React, {Component} from 'react';
import SearchResult from './SearchResult';

import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchSearch } from './_Action';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSearch: []
    }
    this.handleChange = _.debounce(this.handleChange.bind(this), 500);
  }

  componentWillMount() {
    this.props.fetchSearch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dataSearch: nextProps.data})
  }

  handleChange(){
    let val = this.inputTitle.value;
    this.props.update(val);
    this.props.fetchSearch(val);
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
        marginBottom: '1em',
        boxSizing: 'border-box'
      }
    };
    return (
        <div style={{position: 'relative'}}>
            <input type="text" style={style.int} placeholder="Search" ref={el => this.inputTitle = el} onChange={this.handleChange} />
            <SearchResult data={this.state.dataSearch} />
        </div>
    );
  }
}

function mapStateToProps(state) {
    return { data: state.search.film };
}

export default connect(mapStateToProps, { fetchSearch })(Search);