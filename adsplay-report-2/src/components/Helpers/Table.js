import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';

export default class Table extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.Table = $(this.refs.Table).DataTable({
            lengthMenu: [[14, 50, 100, -1], [14, 50, 100, "All"]],
            columns: this.props.columns,
            deferRender: true,
        });
    }

    componentWillUnmount(){
       this.Table.destroy(true);
    }

    componentWillReceiveProps(newProps) {
        var that = this;
        if(that.props.data != newProps.data){
            that.Table.clear();
            newProps.data.forEach(function(item) {
                that.Table.row.add(item);
            });
            that.Table.draw();
        }
    }

    render() {
        return (
            <table ref="Table" className="ui celled unstackable table striped" width="100%">
            </table>
        );
    }
}