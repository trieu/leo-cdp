import React from 'react';
import { Link } from 'react-router';
import AppData from '~/configs/AppData';

class Side extends React.Component {

  iconMenu(icon){
      return {__html: icon};
  }

  render() {
    
    return (
      <nav className="cd-side-nav">
        <ul>
          <li className="cd-label">Main</li>
          {AppData.menus.map((item, index) =>
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
