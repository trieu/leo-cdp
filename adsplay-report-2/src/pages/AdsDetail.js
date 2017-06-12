import React from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import CardMedia from '../components/Helpers/CardMedia';

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
				<div className="col-xs-12 col-sm-6 col-md-4 padding-bottom-1rem DataTable">
					<CardMedia 
						header={this.props.data.name}
						media={checkURL(this.props.data.media) ? <img style={{maxWidth: "100%"}} src={`https://st50.adsplay.net/${this.props.data.media}`} />
											: <video width="100%" controls>
													<source src={`https://ads-cdn.fptplay.net/static/ads/instream/${this.props.data.media}`} type="video/mp4" />
													Your browser does not support HTML5 video.
												</video>
										}
						body={
							<div>
								<p> <strong>Ngày tạo: </strong> <span>{this.props.data.createdDate}</span> </p>
								<p> <strong>Ngày bắt đầu: </strong> <span>{this.props.data.runDate}</span> </p>
								<p> <strong>Ngày kết thúc: </strong> <span>{this.props.data.expiredDate}</span> </p>
							</div>
						}
					/>
				</div>
			</div>
        );
    }
};

function mapStateToProps(state) {
    return { data: state.ads.adsDetail };
}

export default connect(mapStateToProps, { fetchAdsDetail })(Detail);