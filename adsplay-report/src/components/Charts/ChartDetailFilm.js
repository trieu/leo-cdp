/*The loai phim*/
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import NVD3Chart from "react-nvd3";
import moment from 'moment';
import Paper from 'material-ui/Paper';
import globalStyles from '../../styles';
import Loading from '../Loading/LoadingPager';

import { connect } from 'react-redux';
import { fetchDetailFilm } from './_Action';

class ChartDetailFilm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            width: 600,
            height: 460
        }        
    }
    componentWillMount() {
        this.dataSource();
    }

    componentDidMount () {
        var that = this;
        var width = (ReactDOM.findDOMNode(that).offsetWidth > 600) ? 600 : ReactDOM.findDOMNode(that).offsetWidth;
        that.setState({width: width});
		window.addEventListener('resize', _.debounce(function(){
            that.setState({width: ReactDOM.findDOMNode(that).offsetWidth});
        }, 200), true);
	}

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceMedia != nextProps.sourceMedia
         || this.props.beginDate != nextProps.beginDate
         || this.props.endDate != nextProps.endDate){
            this.dataSource(nextProps);
        }
    }

    dataSource(props){
        props = props || this.props;
        let beginDate = moment(props.beginDate).format('YYYY-MM-DD');
        let endDate = moment(props.endDate).format('YYYY-MM-DD');

        this.props.fetchDetailFilm(props.sourceMedia, beginDate, endDate);
    }
    
    render() {       
        const datum = [{
          key: "Cumulative Return",
          values: [
            {
              "label" : "A" ,
              "value" : 29.765957771107
            } ,
            {
              "label" : "B" ,
              "value" : 0
            } ,
            {
              "label" : "C" ,
              "value" : 32.807804682612
            } ,
            {
              "label" : "D" ,
              "value" : 196.45946739256
            } ,
            {
              "label" : "E" ,
              "value" : 0.19434030906893
            } ,
            {
              "label" : "F" ,
              "value" : 98.079782601442
            } ,
            {
              "label" : "G" ,
              "value" : 13.925743130903
            } ,
            {
              "label" : "H" ,
              "value" : 5.1387322875705
            },
             {
              "label" : "I" ,
              "value" : 7.1387322875705
            },
             {
              "label" : "J" ,
              "value" : 9.1387322875705
            }
          ]
        }
      ];
      const datagender = [
        {
            "color": "#8884d8",
            "key" : 'Nam',
            "value" : 2110534
        },
         {
            "color": "#83a6ed",
            "key" : 'Nữ',
            "value" : 1555789
        }
      ];
       const dataage = [
        {
            "color": "#aec7e8",
            "key" : '15 to 35',
            "value" :  29.765957771107
        },
         {
            "color": "#ff7f0e",
            "key" : '36 to 40',
            "value" : 32.807804682612
        },
         {
            "color": "#2ca02c",
            "key" : '41 > ',
            "value" : 196.45946739256
        }
      ];
    
        return (

        <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>              
              <span style={globalStyles.title}>Giới tính</span>
              <div style={globalStyles.clear}/>
              <NVD3Chart
                    id="chart1"
                    width="400"
                    height="400"
                    type="pieChart"
                    datum={datagender}
                    x="key"
                    y="value"
                    labelType="percent"
                    showTooltipPercent="true"
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}}
                />
                 <Loading show={this.props.loading} />
            </Paper>
          </div>    
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>              
              <span style={globalStyles.title}>Độ tuổi</span>
              <div style={globalStyles.clear}/>
              <NVD3Chart
                    id="chart1"
                    width="400"
                    height="400"
                    type="pieChart"
                    datum={dataage}
                    x="key"
                    y="value"
                    labelType="percent"
                    showTooltipPercent="true"
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}}
                />
                 <Loading show={this.props.loading} />
            </Paper>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
            <Paper style={globalStyles.paper}>              
              
              <div style={globalStyles.clear}/>
              <NVD3Chart
                    id="chart"
                    height="400"
                    type="discreteBarChart"
                    datum={datum}
                    x="label"
                    y="value"                    
                    showTooltipPercent="true"
                    tooltip={{ enabled: true,  valueFormatter: function(d){
                                    return d3.format(',.0d')(d);
                            }}}
                />
                <Loading show={this.props.loading} />
            </Paper>
          </div>                                 
    </div>
        )
        
    }


}

function mapStateToProps(state) {
  return { data: state.charts.detailfilm, loading: state.charts.loading_detailfilm };
}

export default connect(mapStateToProps, { fetchDetailFilm })(ChartDetailFilm);
