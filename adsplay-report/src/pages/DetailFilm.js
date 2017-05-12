import React from 'react';
import globalStyles from '../styles';
import Data from '../data';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import moment from 'moment';
import ChartDetailFilm from '../components/Charts/ChartDetailFilm';
import TotalAll from '../components/Total/TotalAll';


class DetailFilm extends React.Component{

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
          disabled: disabled
      };

      this.updateFilter = this.updateFilter.bind(this);
      this.updateSourceMedia = this.updateSourceMedia.bind(this);
    
  }

  updateFilter(beginDate, endDate) {     
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
                if(page.id == 'Detail'){
                return <h2 key={index} style={globalStyles.titlePage}>{page.title}</h2>
                }
            });
    return (
    <div>
        {titlePage}

        <h2>{this.props.params.filmID}</h2>
        <TotalAll sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} bookingHide={true} />      
        <ChartDetailFilm sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />

</div>
    )
  }
};
export default DetailFilm;