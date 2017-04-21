import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import moment from 'moment';
import TableCategory from '../components/Table/DetailCategory';
import FilterDate from '../components/Charts/FilterDate';
import FilterSource from '../components/Charts/FilterSource';
import TotalAll from '../components/Total/TotalAll';

class DetailCategory extends React.Component{

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
          disabled: disabled
      };

      this.updateFilter = this.updateFilter.bind(this);
      this.updateSourceMedia = this.updateSourceMedia.bind(this);
    
  }

  updateFilter(beginDate, endDate) {
      console.log(beginDate, endDate);
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
                if(page.id == 'VOD'){
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
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-6 m-b-15 ">
                <FilterDate update={this.updateFilter} endDate={this.state.endDate} beginDate={this.state.beginDate} />
            </div>        
        
        </div>

        <TotalAll sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate} />

        <TableCategory sourceMedia={this.state.sourceMedia} endDate={this.state.endDate} beginDate={this.state.beginDate}/>  
</div>
    )
  }
};
export default DetailCategory;