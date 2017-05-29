import React from 'react';
import { Link } from 'react-router';
import data from '../../../configs/AppData.js';

class Side extends React.Component {

  iconMenu(icon){
      return {__html: icon};
  }

  render() {
    
    return (
      <nav className="cd-side-nav">
        <ul>
          <li className="cd-label">Main</li>
          {data.menus.map((item, index) =>
            <li className="has-children" key={index}>
              <Link href={item.link}><span dangerouslySetInnerHTML={this.iconMenu(item.icon)}/> {item.text}</Link>
            </li>
          )}
          
        </ul>
      </nav>
    );
  }
}

export default Side;
