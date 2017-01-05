import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import ChartCategory from '../components/Charts/ChartCategory';

const DashboardPage = () => {

  return (
    <div>
      <h3 style={globalStyles.navigation}>Application / Overview</h3>

      <div className="row">

        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
          <Paper style={globalStyles.paper}>
            <span style={globalStyles.title}>Category Report</span>

            <div style={globalStyles.clear}/>
            <ChartCategory />
          </Paper>

          <Paper style={globalStyles.paper}>
            <span style={globalStyles.title}>Category Report</span>

            <div style={globalStyles.clear}/>
            <ChartCategory />
          </Paper>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
