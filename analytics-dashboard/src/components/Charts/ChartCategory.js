import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell , Tooltip , Legend } from 'recharts';

const styles = {
  size: {
    clear: "both",
    height: 300,
  },
  cleatfix: { 
    clear: "both",
  },
  grid50: {
    float: "left",
    width: "50%",
  },
};

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d','#a4de6c', 
                      '#d0ed57', '#FABFA1', '#B86A54', '#FE8A71', '#DC626F',
                      '#FE6860', '#F3C9BF', '#C9C7AF', '#93BFB6', '#7CA39C',
                      '#726680', '#779BF0', '#849FBB', '#C2B6D6', '#EBE1E2'];
const RADIAN = Math.PI / 180;                    

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} textAnchor="middle" fill={COLORS}> {`${(percent * 100).toFixed(0)}%`} </text>
  );
};

const ChartFilter = () => {
  return (
    <div>
        <DatePicker style={styles.grid50}
          hintText="Begin Date"
          floatingLabelText="Begin Date"/>
        <DatePicker style={styles.grid50}
            hintText="End Date"
            floatingLabelText="End Date"/>
    </div>
  );
}

class ChartCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  // getInitialState() {
  //   return { data: [] };
  // }

  componentWillMount(){
    this.dataSource();
  }

  // componentWillReceiveProps(nextProps){
  //   this.dataSource(nextProps);
  // }

  dataSource(props){
    props = props || this.props;

    return $.ajax({
      type: "get",
      dataType: 'json',
      url: 'https://360.adsplay.net/api/categoryview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
    }).done(function(result){
      let data = [];
      
      for(let i in result){
          data.push({ name: result[i].category, value: result[i].contentView , fill: COLORS[i]});
      }
      this.setState({ data: data });
    }.bind(this));
  }

	render () {
  	return (
      <div>
        <ChartFilter/>
        <div style={styles.size}>
          <ResponsiveContainer>
          <PieChart onMouseEnter={this.onPieEnter}>
            <Pie
              data={this.state.data} 
              cx={120} 
              cy={200} 
              innerRadius={40}
              outerRadius={80} 
              fill="#8884d8"
              paddingAngle={5}
              labelLine={false}
              label={renderCustomizedLabel}
            >
            </Pie>
            <Tooltip/>
            <Legend layout="vertical" align="right" verticalAlign="bottom" />
          </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    );
  }
}


export default ChartCategory;