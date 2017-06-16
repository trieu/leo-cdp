import React from 'react';
import Header from './components/Partials/Header';
import Side from './components/Partials/Side';

export default class App extends React.Component {
    constructor(props){
        super(props);
        // Hàm này Thực hiện việc thiết lập state cho component
        // Việc sử dụng super(props) là để có thể sử dụng this.props trong phạm vi hàm constructor này
    }

    componentDidMount(){
        window.CORE()
    }
    
    render() {
        var userInfo = (this.props.userInfo) ? this.props.userInfo : {username: "user", roles: {"user": true}, dataSources: {} }
        return (
            <div id="wrapper">
                <Header userInfo={userInfo} />
                
                <div id="main" ref="Main" className="cd-main-content">
                    <Side />
                    <div className="content-wrapper">
                        {React.cloneElement(this.props.children, {userInfo})}
		            </div>
                </div>

            </div>
        );
    }
};
