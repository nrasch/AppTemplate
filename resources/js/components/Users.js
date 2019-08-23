import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Index from './Index.js'

export default class Users extends Component {
	render() {
		return (
			<div>
				<div className="row justify-content-center">
					<div className="col-12">
						{/* Load the Index component */}
						<Index />
					</div>
				</div>
			</div>
		);
	}
}

if (document.getElementById('users')) {
	ReactDOM.render(<Users />, document.getElementById('users'));
}
