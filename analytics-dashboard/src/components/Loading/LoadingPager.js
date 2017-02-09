import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

class Loading extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show || false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show
        });
    }

    render() {
        const styles = {
            false: {
                display: "none"
            },
            true: {
                display: "flex"
            }
        }

        return (
            <div className="loading-pager" style={styles[this.state.show]}>
                <CircularProgress size={60} thickness={5} />
            </div>
        );
    };
}


export default Loading;