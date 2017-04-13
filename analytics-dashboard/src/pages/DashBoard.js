import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import TotalPlatform from '../components/Charts/TotalPlatform';
import ChartPlatform from '../components/Charts/ChartPlatform';
import ChartCategory from '../components/Charts/ChartCategory';
import ChartTopView from '../components/Charts/ChartTopView';
import ChartTopCategory from '../components/Charts/ChartTopCategory';
import FilterDate from '../components/Charts/FilterDate';
import FilterSource from '../components/Charts/FilterSource';
import TotalPlayview from '../components/Total/TotalPlayview';
import TotalImpression from '../components/Total/TotalImpression';
import TotalCompleteView from '../components/Total/TotalCompleteView';

class DashboardPage extends React.Component{

  constructor(props) {
      super(props);

      var endDate = new Date();
      var beginDate = new Date(moment().subtract(7, 'days').format('YYYY-MM-DD'));

      let name = props.USER.username;
      let disabled = true;
      let sourceMedia = "danet-mienphi";
      if(name.indexOf("admin") != -1){
        sourceMedia = "all";
        disabled = false;
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
      this.updateChartPlatform = this.updateChartPlatform.bind(this);
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

  updateChartPlatform(value){
      //console.log(value)
      this.setState({
          sumChartPlatform: value.toLocaleString()
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
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        {titlePage}

        <div className="row middle-xs">
          <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 m-b-15 ">
            <FilterSource update={this.updateSourceMedia} sourceMedia={this.state.sourceMedia} disabled={this.state.disabled} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 m-b-15 ">
            <FilterDate update={this.updateFilter} endDate={this.state.endDate} beginDate={this.state.beginDate} />
          </div>
        </div>

        <div className="row middle-xs">
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
          {/*<TotalPlatform value={this.state.sumChartPlatform} /> */}
          <TotalPlayview sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate}/>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
          {/*  <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Impression</span>

                    <div style={globalStyles.clear}/>

                    <span style={globalStyles.title}>16,042,859</span>
                </Paper>
            </div>
            */}
            <TotalImpression sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
            {/*<div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Completed-View</span>

                    <div style={globalStyles.clear}/>

                    <span style={globalStyles.title}>4,765,149</span>
                </Paper>
            </div>*/}
            <TotalCompleteView sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Click</span>

                    <div style={globalStyles.clear}/>

                    <span style={globalStyles.title}>127,359</span>
                </Paper>
            </div>
          </div>
        </div>

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
              <ChartPlatform getSum={this.updateChartPlatform} sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />
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
