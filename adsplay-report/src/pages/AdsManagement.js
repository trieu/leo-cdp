import React from 'react';
import globalStyles from '../styles';
import Data from '../data';

import AdsManagementList from '../components/AdsManagement/List';


class AdsManagement extends React.Component{

  constructor(props) {
      super(props);
    
  }

  render() {
    return (
        <div>
              <AdsManagementList />
        </div>
    )
  }
};
export default AdsManagement;