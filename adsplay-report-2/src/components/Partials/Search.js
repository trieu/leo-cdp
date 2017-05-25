import React from 'react';

class Search extends React.Component {
  render() {
    return (
        <div className="cd-search is-hidden">
					<form action="#0">
						<input type="search" placeholder="Search..." />
					</form>
				</div>
    );
  }
}

export default Search;
