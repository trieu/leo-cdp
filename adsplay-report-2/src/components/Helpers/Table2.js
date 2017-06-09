import React from 'react';
import ReactDOM from 'react-dom';

export default class Datatable extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
        columns: React.PropTypes.array,
        order: React.PropTypes.array,
        dataSource: React.PropTypes.func,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const options = Object.assign({
            ajax: this.props.dataSource,
        }, this.props);
        this.Table = $(this.getTableDomNode()).DataTable(options); // eslint-disable-line new-cap
    }

    componentWillUnmount() {
        const table = $(this.getTableDomNode()).DataTable(); // eslint-disable-line new-cap
        table.destroy();
    }

    componentWillReceiveProps(newProps) {
        this.Table.destroy();
        this.Table = $(this.getTableDomNode()).DataTable();
    }

    getTableDomNode() {
        return ReactDOM.findDOMNode(this);
    }

    renderBody(data) {
        if (data.length <= 0) {
            return;
        }
        return (
            <tbody>
                {data.map((item, key) => {
                    var row = item.map((cell, k) => <td key={k}>{cell}</td>);
                    return <tr key={key}>{row}</tr>
                })}
            </tbody>
        )
    }

    renderColumns(data) {
        if (data.length <= 0) {
            return (
                <thead><tr></tr></thead>
            )
        }

        return (
                <thead>
                    <tr>
                        {data.map((item, key) => {
                            <th key={key}>{item.title}</th>
                        })}
                    </tr>
                </thead>
            );
    }


    render() {
        return (
            <table className="table table-striped table-hover">
                {this.renderColumns(this.props.columns)}
                {this.renderBody(this.props.data)}
            </table>
        );
    }
}