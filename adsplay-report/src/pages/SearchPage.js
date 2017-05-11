import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import SearchInput from '../components/SearchBox/SearchInput';
import SearchResult from '../components/SearchBox/SearchResult';

class SearchPage extends React.Component{

  constructor(props) {
      super(props);
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
                <div className="col-xs-12">
                    <SearchInput />
                </div>
                <div className="col-xs-12 m-b-15 ">
                    <SearchResult />
                </div>
            </div>
    </div>
    )
  }
};
export default SearchPage
;