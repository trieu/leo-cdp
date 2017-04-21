import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import ChartPlatform from '../components/Charts/ChartPlatform';
import ChartCategory from '../components/Charts/ChartCategory';
import ChartTopView from '../components/Charts/ChartTopView';
import ChartTopCategory from '../components/Charts/ChartTopCategory';
import FilterDate from '../components/Charts/FilterDate';
import FilterSource from '../components/Charts/FilterSource';
import TotalAll from '../components/Total/TotalAll';

class DashboardPage extends React.Component{

  constructor(props) {
      super(props);

      var endDate = new Date();
      var beginDate = new Date(moment().subtract(7, 'days').format('YYYY-MM-DD'));

      let name = props.USER.username;
      let roles = props.USER.roles;
      let disabled = true;
      let sourceMedia = "danet-mienphi";
      if(typeof (roles) !== "undefined"){
        if(roles["admin"] || roles["superadmin"]){
          sourceMedia = "all";
          disabled = false;
        }
      }
      
      //console.log(sourceMedia)
      this.state = {
          USER: props.USER,
          endDate: endDate,
          beginDate: beginDate,
          sourceMedia: sourceMedia,
          sumChartPlatform: 0,
          disabled: disabled
      };

      this.updateFilter = this.updateFilter.bind(this);
      this.updateSourceMedia = this.updateSourceMedia.bind(this);
  }

  updateFilter(beginDate, endDate) {
      //console.log(beginDate, endDate);
      this.setState({
          beginDate: beginDate,
          endDate: endDate
      });
  }

  updateSourceMedia(value){
      this.setState({
          sourceMedia: value
      });
  }

  render() {
    const titlePage = Data.pages.map((page , index) => {
        if(page.id == 'DashBoard'){
          return <h2 key={index} style={globalStyles.titlePage}>{page.title}</h2>
        }
    });

    return (
      <div>
        {titlePage}

        <div className="row middle-xs">
          <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 m-b-15 ">
            <FilterSource update={this.updateSourceMedia} sourceMedia={this.state.sourceMedia} disabled={this.state.disabled} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 m-b-15 ">
            <FilterDate update={this.updateFilter} endDate={this.state.endDate} beginDate={this.state.beginDate} />
          </div>
        </div>

        <TotalAll sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />

        <div className="row">

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>Thể loại phim</span>

              <div style={globalStyles.clear}/>
              <ChartCategory sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>Nền tảng thiết bị</span>

              <div style={globalStyles.clear}/>
              <ChartPlatform sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>10 phim xem nhiều nhất</span>

              <div style={globalStyles.clear}/>
              <ChartTopView sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>Phim xem nhiều theo thể loại</span>

              <div style={globalStyles.clear}/>
              <ChartTopCategory sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

        </div>
      </div>
    );
  }
};

export default DashboardPage;
