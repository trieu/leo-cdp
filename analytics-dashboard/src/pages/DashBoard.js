import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import ChartPlatform from '../components/Charts/ChartPlatform';
import ChartCategory from '../components/Charts/ChartCategory';
import ChartContentView from '../components/Charts/ChartContentView';
import ChartFilter from '../components/Charts/ChartFilter';

class DashboardPage extends React.Component{

  constructor(props) {
      super();
      var endDate = new Date();
      var beginDate = new Date(moment().subtract(7, 'days').format('YYYY-MM-DD'));

      this.state = {
          endDate: endDate,
          beginDate: beginDate
      };

      this.updateFilter = this.updateFilter.bind(this);

  }

  updateFilter(beginDate, endDate) {
      console.log(beginDate, endDate);
      this.setState({
          beginDate: beginDate,
          endDate: endDate
      });
  }

  render() {
    return (
      <div>
        <h3 style={globalStyles.navigation}>Application / Overview</h3>

        <ChartFilter update={this.updateFilter} endDate={this.state.endDate} beginDate={this.state.beginDate} />

        <div className="row">

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>Thể loại phim</span>

              <div style={globalStyles.clear}/>
              <ChartCategory endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>Nền tảng thiết bị</span>

              <div style={globalStyles.clear}/>
              <ChartPlatform endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
            <Paper style={globalStyles.paper}>
              <span style={globalStyles.title}>30 phim xem nhiều nhất</span>

              <div style={globalStyles.clear}/>
              <ChartContentView endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </Paper>
          </div>

        </div>
      </div>
    );
  }
};

export default DashboardPage;
