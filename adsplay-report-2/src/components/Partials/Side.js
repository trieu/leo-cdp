import React from 'react';
import { Link } from 'react-router';
import AppData from '~/configs/AppData';

class Side extends React.Component {
  iconMenu(icon){
      return {__html: icon};
  }

  renderMenuReport(data){
    let menu, props = this.props;
    data.forEach(function(item) {
      item.roles.forEach(function(i, index){
        console.log(props)
        if(props.userInfo.roles[i]){
          console.log(i)
          menu = (
            <li key={index}>
              <Link to={item.link}><span dangerouslySetInnerHTML={this.iconMenu(item.icon)}/> {item.text}</Link>
            </li>
          );
        }
        else{
          menu = ("");
        }
      })
    });
    return menu;
  }

  render() {
    return (
      <nav className="cd-side-nav">
        <ul>
          <li className="cd-label">{AppData.menus.menuReport}</li>
          {this.renderMenuReport(AppData.menuReport)}
        </ul>

        <ul>
          <li className="cd-label">{AppData.menus.menuManager}</li>
          {AppData.menuManager.map((item, index) =>
            <li key={index}>
              <Link to={item.link}><span dangerouslySetInnerHTML={this.iconMenu(item.icon)}/> {item.text}</Link>
            </li>
          )}
          
        </ul>
      </nav>
    );
  }
}

export default Side;
