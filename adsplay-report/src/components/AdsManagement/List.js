import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import globalStyles from '../../styles';
import Data from '../../data';
import ReactTable from 'react-table';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchAdsList } from './_Action';
import {getCookie} from '../Services/Cookie';
import Toggle from 'material-ui/Toggle';

class List extends React.Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.dataSource();
    }

    dataSource(props) {
        props = props || this.props;
        this.props.fetchAdsList();
    }

    render() {
        const access_token = getCookie('user_token');
        var dcol = [
            { key: 'id', name: 'Mã quảng cáo' },
            { key: 'name', name: 'Tên' },
            { key: 'bookingTime', name: 'Thời gian chạy' },
            { key: 'status', name: 'Trạng thái' }
        ]
        const columns = [];
        dcol.forEach(function(item) {
            if(item.key == 'status'){
                
                columns.push(
                    {
                        header: item.name,
                        id: item.key,
                        accessor: item.key,
                        render: row => {
                            const status = (row.value == 'Running') ? true : false;
                            return (row.value == 'Pending' || row.value == 'Running') ? <Toggle 
                                    value={row.rowValues.id}
                                    style={{display: "inline-block", width: "auto"}}
                                    defaultToggled={status}
                                    onToggle={
                                        (event, isInputChecked)=>{
                                            const id = event.target.value;
                                            const status = (isInputChecked) ? 2 : 1; 
                                            axios.get('//id.adsplay.net/ads/api-roles-ads/update/status?access_token='+access_token+'&id=' + id + '&status=' + status)
                                                .then(function (response) {
                                                    //console.log(response)
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                });
                                            //console.log(event.target.value, isInputChecked)
                                        }
                                    }
                                    /> : row.value;
                        }
                    }
                )
            }
            else{
                columns.push(
                    {
                        header: item.name,
                        id: item.key,
                        accessor: item.key,
                        render: row => {
                            const html = (item.key == 'name') ? <Link to={"/adsmanagement/" + row.rowValues.id}><span title={row.value}>{row.value}</span></Link> : <span title={row.value}>{row.value}</span>; 
                            return html;
                        }
                    }
                )
            }
        });

        const titlePage = Data.pages.map((page , index) => {
            if(page.id == 'ADS'){
            return <h2 key={index} style={globalStyles.titlePage}>{page.title}</h2>
            }
        });

        return (
            <div>
                {titlePage}
                <div className = "row" >
                    <div className = "col-xs-12 m-b-15 " >
                        <ReactTable className = '-striped -highlight'
                            data = { this.props.data }
                            columns = { columns }
                            defaultPageSize = { 20 }
                            resizable={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return { data: state.ads.adsList };
}

export default connect(mapStateToProps, { fetchAdsList })(List);