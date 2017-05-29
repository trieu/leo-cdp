import React from 'react';
import Search from './Search';
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
							<a>
								<img src="img/cd-avatar.png" alt="avatar" />
								{AppData.UserName}
							</a>

							<ul>
								<li><a href="#0">Logout</a></li>
							</ul>
						</li>
					</ul>
				</nav>
			</header>
    );
  }
};
