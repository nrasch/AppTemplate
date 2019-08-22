// Standard import items
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Our custom components
import TableExportAndSearch from './TableExportAndSearch';

// React BootstrapTable import items
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';


export default class Index extends Component {

	// Class constructor
	constructor(props) {

		super(props);

		this.state = {
			// Container for data fetched from the backend
			userData: [],
			// Track if we have an outstanding call to the backend in progress
			loading: false,
		};

		//Bindings
		this.fetchUserData = this.fetchUserData.bind(this);
	}

	// Actions to take once the component loads
	componentDidMount() {
		this.fetchUserData();
	}

	// Fetch list of users from backend and assign to state data property
	fetchUserData() {

		// Indicate component is fetching data
		this.setState({
			loading: true,
		});

		// Make ajax call to backend to fetch user data
		axios.get('/get_users')
		.then( (response) => {
			// If data was returned assign to state userData variable
			// otherwise assign an empty array to the userData variable
			if (response.data) {
				this.setState({
					userData: response.data.data
				});
			} else {
				// No data was returned from the ajax call
				this.setState({
					userData: []
				});
			}
		})
		.catch(function (error) {
			// Log any errors
			console.log(error);
		})
		.then( () => {
			// Indicate component is finished fetching data
			this.setState({
				loading: false,
			});
		});
	}
	// END fetchUserData()

	// Show/hide the create new user modal
	toggleCreateModal() {
		//
	}

	// Wrap the user's role(s) in a bootstrap badge element
	// Called by the user data table below
	roleTableFormatter(cell, row) {
		return (
			<span>
			{ cell.map( (val, index) => {
				return <span key={index} className="badge badge-primary mr-2">{ val.name }</span>
			})}
			</span>
		)
	}

	// Extract the user's role(s) into a comma delimited string
	// Called by the user data table below
	roleCSVFormatter(cell, row, rowIndex) {
		let roles = cell.map( (val, index) => {
			return val.name;
		});

		// Note the backticks below... template literals
		// Ref:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		return `${roles.join(",")}`;
	}


	// Examine this.props and this.state and return class response (typicall React elements)
	render() {

		// Configure what should be shown if no data is returned from the ajax calll
		// Ref https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/overlay.html
		const NoDataIndication = () => (
			<span className="font-italic">No data found....</span>
		);

		// Define data table columns and which data fields the values should come from
		const columns = [
			{
				dataField: 'id',
				text: 'User ID',
				sort:true,
			}, {
				dataField: 'name',
				text: 'Name',
				sort:true,
			}, {
				dataField: 'email',
				text: 'Email',
				sort:true,
			}, {
				dataField: 'roles',
				text: 'Roles',
				sort:true,
				formatter: this.roleTableFormatter,
				csvFormatter: this.roleCSVFormatter,
			},

		];

		// Prepare and return React elements
		return(
			<div>
				{/* Card div */}
				<div className="card">
					<div className="card-header">User Index</div>

					{/* Card body div */}
					<div className="card-body">
						{/*
							Provide export and search features via the ToolkitProvider
							Ref:  https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/toolkits-getting-started.html
						*/}
							<ToolkitProvider
								bootstrap4={ true }
								keyField="id"
								data={ this.state.userData }
								columns={ columns }
								search
								exportCSV
							>
							{
								props => (
									<div>
										{/* Show/hide create user modal */}
										<div>
											<button type="button" className="btn btn-outline-success" onClick={this.toggleCreateModal}>
											<i className="fa fa-fw fa-plus"></i> Create User
											</button>
										</div>
										{/* END Show/hide create user modal */}

										{/* Render CSV export and search components for data table */}
										<TableExportAndSearch csvProps={ props.csvProps } searchProps= { props.searchProps } />
										{/* END Render CSV export and search components for data table */}

										{/* Create the user data table */}
										<BootstrapTable
											{ ...props.baseProps }
											loading={ this.state.loading }
											pagination={ paginationFactory() }
											striped={ true }
											bordered={ true }
											hover={ true }
											rowClasses="font-size-sm"
											noDataIndication={ () => <NoDataIndication /> }
											overlay={ overlayFactory({ spinner: true, background: 'rgba(220,220,220,0.3)', text: 'Loading....' }) }
										/>
										{/* END Create the user data table */}
									</div>
								)
							}
							</ToolkitProvider>
							{/* END ToolkitProvider */}

						</div>
						{/* END Card body div */}

					</div>
					{/* END Card div */}

				</div>
		);
	}
	// END render

}
