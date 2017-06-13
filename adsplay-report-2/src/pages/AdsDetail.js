import React from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import Toggle from '../components/Helpers/Toggle';
import axios from 'axios';
import {getCookie} from '../components/Helpers/Cookie';

import { connect } from 'react-redux';
import { fetchAdsDetail } from '../reducers/Ads/action';

class Detail extends React.Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.dataSource();
    }

    dataSource(props) {
        props = props || this.props;
        this.props.fetchAdsDetail(props.params.id);
    }

    handleChange(value, checked){
		const access_token = getCookie('user_token');
		const status = (checked) ? 2 : 1; 
		axios.get('//id.adsplay.net/ads/api-roles-ads/update/status?access_token='+access_token+'&id=' + value + '&status=' + status)
			.then(function (response) {
				//console.log(response)
			})
			.catch(function (error) {
				console.log(error);
			});
    }

    render() {

        const checkEmpty = Object.keys(this.props.data).length === 0 && this.props.data.constructor === Object;
        if(checkEmpty){
            return (<div>No Data</div>);
        }

        const checkURL = function(url) {
            return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        }

        return (
			<div className="row">
				<div className="col-xs-12 col-sm-6 col-md-4 padding-bottom-1rem">
                    {checkURL(this.props.data.media) ? 
                        <img style={{maxWidth: "100%"}} src={`https://st50.adsplay.net/${this.props.data.media}`} />
                        : <video width="100%" controls>
                                <source src={`https://ads-cdn.fptplay.net/static/ads/instream/${this.props.data.media}`} type="video/mp4" />
                                Your browser does not support HTML5 video.
                            </video>
                    }
				</div>
                <div className="col-xs-12 col-sm-6 col-md-8 padding-bottom-1rem">
                    <h3>Thông tin quảng cáo</h3>
                    <table className="ui definition striped table">
                        <tbody>
                            <tr>
                                <td style={{width: "250px"}}>Tên: </td>
                                <td>{this.props.data.name}</td>
                            </tr>
                            <tr>
                                <td>Ngày tạo: </td>
                                <td>{this.props.data.createdDate}</td>
                            </tr>
                            <tr>
                                <td>Ngày bắt đầu: </td>
                                <td>{this.props.data.runDate}</td>
                            </tr>
                            <tr>
                                <td>Ngày kết thúc: </td>
                                <td>{this.props.data.expiredDate}</td>
                            </tr>
                            <tr>
                                <td>Tổng số Booking: </td>
                                <td>{this.props.data.totalBooking.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Tổng số ngày Booking: </td>
                                <td>{this.props.data.dailyBooking.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Trạng thái: </td>
                                <td>
                                    {(this.props.data.status == 'Chờ duyệt' || this.props.data.status == 'Đã duyệt') ? 
                                    <Toggle value={this.props.data.id} 
									toggleLabel={['Đã duyệt','Chờ duyệt']}
									checked={(this.props.data.status == 'Đã duyệt') ? true : false}
									onChange={this.handleChange} /> : this.props.data.status
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
			</div>
        );
    }
};

function mapStateToProps(state) {
    return { data: state.ads.adsDetail };
}

export default connect(mapStateToProps, { fetchAdsDetail })(Detail);