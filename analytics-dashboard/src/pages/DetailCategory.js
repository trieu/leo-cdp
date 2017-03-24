import React from 'react';
import globalStyles from '../styles';
import Data from '../data';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ReactTable from 'react-table';

class DetailCategory extends React.Component{

  constructor(props) {
      super(props);
  }
  

  render() {
    const titlePage = Data.pages.map((page , index) => {
        if(page.id == 'DashBoard'){
          return <h2 key={index} style={globalStyles.titlePage}>{page.title}</h2>
        }
    });

    const data = [
        {
            name: "film 1",
            category: "kinhdi",
            playview: 12345,
            impression: 566721,
            trueview: 9000,
            click: 222,
            revenue: '20,000,000'
        },
        {
            name: "film 2",
            category: "kinhdi",
            playview: 12345,
            impression: 566721,
            trueview: 9000,
            click: 222,
            revenue: '20,000,000'
        },
        {
            name: "film 3",
            category: "kinhdi",
            playview: 12345,
            impression: 566721,
            trueview: 9000,
            click: 222,
            revenue: '20,000,000'
        },
        {
            name: "film 4",
            category: "kinhdi",
            playview: 12345,
            impression: 566721,
            trueview: 9000,
            click: 222,
            revenue: '20,000,000'
        },
        {
            name: "film 5",
            category: "kinhdi",
            playview: 12345,
            impression: 566721,
            trueview: 9000,
            click: 222,
            revenue: '20,000,000'
        }
    ];

    const columns = [
        {
            header: 'Name',
            accessor: 'name'
        },
        {
            header: 'Category',
            accessor: 'category'
        },
        {
            header: 'Playview',
            accessor: 'playview'
        },
        {
            header: 'Impression',
            accessor: 'impression'
        },
        {
            header: 'Trueview',
            accessor: 'trueview'
        },
        {
            header: 'Click',
            accessor: 'click'
        },
        {
            header: 'Revenue',
            accessor: 'revenue'
        }
    ]

    return (
      <div>
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        {titlePage}

        <div className="row middle-xs">
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Play View</span>

                    <div style={globalStyles.clear}/>
                    
                    <span style={globalStyles.title}>10,033,555</span>
                </Paper>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Impression</span>

                    <div style={globalStyles.clear}/>
                    
                    <span style={globalStyles.title}>16,042,859</span>
                </Paper>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
            <div>
                <Paper style={globalStyles.paper}>
                    <span style={globalStyles.caption}>Total Completed-View</span>

                    <div style={globalStyles.clear}/>
                    
                    <span style={globalStyles.title}>4,765,149</span>
                </Paper>
            </div>
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
            <div className="col-xs-12 col-sm-6 col-md-3 m-b-15">
                <SelectField
                floatingLabelText="City"
                value={1}
                >
                <MenuItem value={1} primaryText="London" />
                <MenuItem value={2} primaryText="Paris" />
                <MenuItem value={3} primaryText="Rome" />
                </SelectField>
            </div>
        </div>

        <div className="row">
            <div className="col-xs-12 m-b-15 ">
                <ReactTable
                    className='-striped -highlight'
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                />
            </div>
        </div>
      </div>
    );
  }
};

export default DetailCategory;
