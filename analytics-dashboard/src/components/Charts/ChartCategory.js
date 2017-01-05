import React from 'react';
import { PieChart, Pie, Sector, Cell , Tooltip , Legend } from 'recharts';

const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;                    

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} textAnchor="middle" fill={COLORS}> {`${(percent * 100).toFixed(0)}%`} </text>
  );
};


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

  componentWillReceiveProps(nextProps){
    this.dataSource(nextProps);
  }

  dataSource(props){
    props = props || this.props;

    return $.ajax({
      type: "get",
      dataType: 'json',
      url: 'https://360.adsplay.net/api/categoryview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
    }).done(function(result){
      var data = [];
      for(var i in result){
          data.push({ name: result[i].category, value: result[i].contentView });
      }
      this.setState({ data: data });
    }.bind(this));
  }

	render () {
  	return (
    	<PieChart width={500} height={400} onMouseEnter={this.onPieEnter}>
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
        	{
          	data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
        <Tooltip/>
        <Legend layout="vertical" align="right" verticalAlign="top" />
      </PieChart>
    );
  }
}


export default ChartCategory;