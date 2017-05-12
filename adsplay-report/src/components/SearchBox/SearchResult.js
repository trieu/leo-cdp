import React, { Component, PropTypes } from 'react';
import Pagination from '../Pagination/index';
import { Link } from 'react-router';
import Visibility from 'material-ui/svg-icons/action/visibility';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data || [],
            pageOfItems: []
        };

        this.onChangePage = this.onChangePage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.data != nextProps.data){
            this.setState({data: nextProps.data});
        }
    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    render() {
        const styles = {
            icon: {
                verticalAlign: 'bottom',
                width: '18px',
                height: '18px'
            }
        }
        if (this.state.data.length <= 0) {
            return (
                <p>No data</p>
            )
        };
        return ( 
            <div>
                {this.state.pageOfItems.map((item, key) =>
                    <div className="media" key={key}>
                        <div className="media-left">
                            <Link to={"/detailFilm/" + item.contentId}>
                                <img className="media-object media-maxw" src={item.image} />
                            </Link>
                        </div>
                        <div className="media-body">
                            <h4 className="media-heading">
                                <Link to={"/detailFilm/" + item.contentId}>
                                    {item.name}
                                </Link>
                            </h4>
                            <p title="Thể loại">{item.category}</p>
                            <p title="Playview"><Visibility style={styles.icon} /> {item.playview}</p>
                        </div>
                    </div>
                )}
                <Pagination items={this.state.data} onChangePage={this.onChangePage} />
            </div>
        );
    }
};

export default SearchResult;