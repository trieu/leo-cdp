import React from 'react';

var Bookss = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  componentWillMount: function(){
    this.dataSource();
  },

  componentWillReceiveProps: function(nextProps){
    this.dataSource(nextProps);
  },

  dataSource: function(props){
    props = props || this.props;

    return $.ajax({
      type: "get",
      dataType: 'json',
      url: 'https://360.adsplay.net/api/categoryview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
    }).done(function(result){
      this.setState({ data: result });
    }.bind(this));
  },

  render: function() {
    var books = this.state.data.map(function(book) {
      return (
        <li key={book.contentView}>{book.category}</li>
      );
    });

    return (
      <div>
        <ul>
          {books}
        </ul>
      </div>
    );
  }
});

export default Bookss;