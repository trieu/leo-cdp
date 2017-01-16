/**
 * Created by anhvt on 09/01/2017.
 */
/**
 * Created by anhvt on 09/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import Chart from 'chart.js';
import RC2 from 'react-chartjs2';


const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
        }
    ]
};




class ChartContentView extends Component {
    constructor(props) {

        // Pass props to parent class
        super(props);
        // Set initial state
        this.state = {data: {}}
        // this.apiUrl = 'https://360.adsplay.net/api/platformview/report?startDate=2016-12-09%2014:00:00&endDate=2016-12-20%2014:00:00'
    }

    componentWillMount() {
        this.dataSource();

    }
    dataSource(props){
        props = props || this.props;
        return $.ajax({
            type: "get",
            dataType: 'json',
            url: 'https://360.adsplay.net/api/contentview/report?startDate=2016-11-20%2014:00:00&endDate=2016-12-20%2014:00:00&limit=10',
        }).done(function(result){
            console.log(result)
            var data = {};
            var videoTitle = [];
            var contentView = [];
            for(var i in result){
                // // var temp = result[i].videoTitle.match(/[A-Z]+/g);
                // var temp = result[i].videoTitle.substring(0, 8) + "......";
                // // data.push({ name: temp, pv: result[i].contentView,vc: result[i].videoCategory });
                //
                videoTitle.push(result[i].videoTitle);
                contentView.push(result[i].contentView);
            }
            console.log(videoTitle)
            console.log(contentView)
            data = {
                labels: videoTitle,
                datasets: [
                    {
                        label: 'View',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: contentView,
                    }
                ]
            };

            this.setState({ data: data });
            // console.log(111)
            // console.log(data)
        }.bind(this));

    }
    render() {
        return (
            <RC2 data={this.state.data} type='horizontalBar' />
        );
    }
}


export default ChartContentView