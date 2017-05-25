import React from 'react';
import Header from './components/Partials/Header';
import Side from './components/Partials/Side';

export default class App extends React.Component {
    constructor(props){
        super(props);
        // Hàm này Thực hiện việc thiết lập state cho component
        // Việc sử dụng super(props) là để có thể sử dụng this.props trong phạm vi hàm constructor này
    }
    
    render() {
        return (
            <div id="wrapper">
                <Header />
                
                <div id="main" className="cd-main-content">
                    <Side />
                    <div className="content-wrapper">
                        {this.props.children}
		            </div>
                </div>

            </div>
        );
    }
};
