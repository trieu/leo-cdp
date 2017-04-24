import React, { Component, PropTypes } from 'react';
import globalStyles from '../../styles';
import Data from '../../data';
import ReactTable from 'react-table';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchDetailCategory } from './_Action';

class Category extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.dataSource();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sourceMedia != nextProps.sourceMedia ||
            this.props.beginDate != nextProps.beginDate ||
            this.props.endDate != nextProps.endDate) {
            this.dataSource(nextProps);
        }
    }

    dataSource(props) {
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        this.props.fetchDetailCategory(props.sourceMedia, beginDate, endDate);
    }

    render() {
        const columns = [{
                header: 'Name',
                id: 'name',
                accessor: d => d.name,
                render: row => {
                    return <span title={row.value}>{row.value}</span>
                },
                filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
            },
            {
                header: 'Category',
                accessor: 'category'
            },
            {
                header: 'Playview',
                accessor: 'playview'
            },
            {
                header: 'Impression',
                accessor: 'impression'
            },
            {
                header: 'Trueview',
                accessor: 'trueview'

            },
            {
                header: 'Click',
                accessor: 'click'
            },
            {
                header: 'Revenue',
                accessor: 'revenue'
            }
        ]


        return ( <
            div className = "row" >
                <div className = "col-xs-12 m-b-15 " >
                    <ReactTable className = '-striped -highlight'
                        data = { this.props.data }
                        columns = { columns }
                        defaultPageSize = { 20 }
                        resizable={true}
                        showFilters={true}
                    />
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return { data: state.details.detailcategory };
}

export default connect(mapStateToProps, { fetchDetailCategory })(Category);