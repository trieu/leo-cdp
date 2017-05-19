import React from 'react';
import globalStyles from '../styles';
import Data from '../data';

import AdsManagementDetail from '../components/AdsManagement/Detail';


class AdsManagement extends React.Component{

  constructor(props) {
      super(props);
      
  }

  render() {
    return (
        <div>
              <AdsManagementDetail id={this.props.params.id} />
        </div>
    )
  }
};
export default AdsManagement;