import React from 'react';
import Search from './Search';
import Logout from '../Auth/Logout';
import AppData from '~/configs/AppData';

export default class Header extends React.Component {
  render() {
    return (
      <header id="header" className="cd-main-header">
				<a href="/" className="cd-logo">{AppData.appName}</a>
				
				<Search />

				<a href="#" className="cd-nav-trigger">Menu<span></span></a>

				<nav className="cd-nav">
					<ul className="cd-top-nav">
						<li className="has-children account">
							<a style={{"cursor": "pointer"}}>
								<img src="img/cd-avatar.png" alt="avatar" />
								{this.props.userInfo.username}
							</a>

							<ul>
								<li><Logout text="Đăng Xuất" /></li>
							</ul>
						</li>
					</ul>
				</nav>
			</header>
    );
  }
};
