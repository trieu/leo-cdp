import React from 'react';
import Search from './Search';
import Logo from './Logo';

export default class Header extends React.Component {
  render() {
    return (
      <header id="header" className="cd-main-header">
				<a href="#0" className="cd-logo">Adsplay Report</a>
				
				<Search />

				<a href="#0" className="cd-nav-trigger">Menu<span></span></a>

				<nav className="cd-nav">
					<ul className="cd-top-nav">
						<li><a href="#0">Tour</a></li>
						<li><a href="#0">Support</a></li>
						<li className="has-children account">
							<a href="#0">
								<img src="img/cd-avatar.png" alt="avatar" />
								Account
							</a>

							<ul>

								<li><a href="#0">My Account</a></li>
								<li><a href="#0">Edit Account</a></li>
								<li><a href="#0">Logout</a></li>
							</ul>
						</li>
					</ul>
				</nav>
			</header>
    );
  }
};
