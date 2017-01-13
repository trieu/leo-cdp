import React,  { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, blue600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';

const LeftDrawer = (props) => {

  const styles = {
    logo: {
      cursor: 'pointer',
      fontSize: 22,
      textAlign: 'center',
      color: typography.textFullWhite,
      fontWeight: typography.fontWeightLight,
      backgroundColor: blue600,
      paddingLeft: 15,
      paddingRight: 15,
      height: 56,
      lineHeight: '56px',
      //lineHeight: `${spacing.desktopKeylineIncrement}px`,
    },
    menuItem: {
      color: white,
      fontSize: 14
    },
    avatar: {
      div: {
        padding: '15px 0 20px 15px',
        height: 45
      },
      icon: {
        float: 'left',
        display: 'block',
        marginRight: 15,
        boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
      },
      span: {
        paddingTop: 12,
        display: 'block',
        color: 'white',
        fontWeight: 300,
        textShadow: '1px 1px #444'
      }
    }
  };

  return (
    <Drawer
      docked={true}
      open={props.navDrawerOpen}>
        <div style={styles.logo}>
          {props.appTitle}
        </div>
        <div style={styles.avatar.div}>
          <Avatar src="public/img/avatar.jpg"
                  size={50}
                  style={styles.avatar.icon}/>
          <span style={styles.avatar.span}>{props.username}</span>
        </div>
        <div>
          {props.menus.map((menu, index) =>
            <MenuItem
              key={index}
              style={styles.menuItem}
              primaryText={menu.text}
              leftIcon={menu.icon}
              containerElement={<Link to={menu.link}/>}
            />
          )}
        </div>
    </Drawer>
  );
};

// LeftDrawer.propTypes = {
//   navDrawerOpen: PropTypes.bool,
//   menus: PropTypes.array,
//   username: PropTypes.string,
//   appTitle: PropTypes.string
// };

export default LeftDrawer;
