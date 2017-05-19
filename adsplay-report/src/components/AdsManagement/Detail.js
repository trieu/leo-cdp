import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import globalStyles from '../../styles';
import Data from '../../data';
import ReactTable from 'react-table';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchAdsDetail } from './_Action';
import Toggle from 'material-ui/Toggle';

class Detail extends React.Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.dataSource();
    }

    dataSource(props) {
        props = props || this.props;
        this.props.fetchAdsDetail(props.id);
    }

    render() {
        var dcol = [
            { key: 'id', name: 'Id' },
            { key: 'name', name: 'Name' },
            { key: 'bookingTime', name: 'Booking Time' },
            { key: 'status', name: 'Status' }
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
                                            axios.post('/api/update/status?id=' + id + '&status=' + status)
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

        const checkEmpty = Object.keys(this.props.data).length === 0 && this.props.data.constructor === Object;
        if(checkEmpty){
            return (<div>No Data</div>);
        }

        const checkURL = function(url) {
            return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        }

        return (
            
            <div>
                <h2 style={globalStyles.titlePage}>{this.props.data.name}</h2>
                <div className = "row" >
                    <div className = "col-xs-12 col-sm-6 col-md-4 m-b-15 " >
                        {checkURL(this.props.data.media) ? <img style={{maxWidth: "100%"}} src={`https://st50.adsplay.net/${this.props.data.media}`} />
                            : <video width="100%" controls>
                                    <source src={`https://ads-cdn.fptplay.net/static/ads/instream/${this.props.data.media}`} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                </video>
                        }
                    </div>
                    <div className = "col-xs-12 col-sm-6 col-md-8 m-b-15 " >
                        <table className="responsive-table bordered">
                            <tbody>
                            <tr>
                                <td><strong>Created date</strong></td>
                                <td><span>{this.props.data.createdDate}</span></td>
                            </tr>
                            <tr>
                                <td><strong>Run date</strong></td>
                                <td><span>{this.props.data.runDate}</span></td>
                            </tr>
                            <tr>
                                <td><strong>Expired date</strong></td>
                                <td><span>{this.props.data.expiredDate}</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return { data: state.ads.adsDetail };
}

export default connect(mapStateToProps, { fetchAdsDetail })(Detail);