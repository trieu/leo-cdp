import React, { Component, PropTypes } from 'react';
import ReactTable from 'react-table';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {columns} = this.props;
        const col = [];
        columns.forEach(function(item) {
            col.push(
                {
                    header: item.name,
                    id: item.key,
                    accessor: item.key,
                    render: row => {
                        return <span title={row.value}>{row.value}</span>
                    }
                }
            )
        });

        return ( <
            div className = "row" >
                <div className = "col-xs-12 m-b-15 " >
                    <ReactTable className = '-striped -highlight'
                        data = {this.props.data}
                        loading={this.props.loading}
                        columns = {col}
                        defaultPageSize = {10}
                        resizable={true}
                    />
                </div>
            </div>
        );
    }
};

export default SearchResult;