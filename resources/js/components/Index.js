// Standard import items
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Our custom components
import TableExportAndSearch from './TableExportAndSearch';
import TableActions from './TableActions';
import CreateForm from './CreateForm'
import EditForm from './EditForm'
import DeleteForm from './DeleteForm'
import FormModal from './FormModal'

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

			user: null,

			modalsOpen: {
				create: false,
				edit: false,
				delete: false,
			}
		};

		//Bindings
		this.fetchUserData = this.fetchUserData.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
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

	// Show/hide the create/edit/delete modals and track which user we are taking action on
	toggleModal(modal, user) {
		const currentModalState = this.state.modalsOpen[modal];

		if (this.state.modalsOpen[modal]) {
			this.fetchUserData();
		}

		// Note the brackets around the word 'modal'
		// Computed properties:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
		this.setState({
			modalsOpen: {
				[modal]: !currentModalState
			},
			user: user,
		});
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


	// Examine this.props and this.state and return class response (typical React elements)
	render() {

		// Configure what should be shown if no data is returned from the ajax calll
		// Ref https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/overlay.html
		const NoDataIndication = () => (
			<span className="font-italic">No data found....</span>
		);

		// Define a list of actions we want to be able to take on a given user
		// These are displayed in the datatables's dummy 'Action' column which is defined below
		const actions = [
			{
				title: "Edit User",
				onClick: this.toggleModal,
				modalType: 'edit',
				class: "text-secondary",
				icon: "fa fa-fs fa-pencil-alt",
			},
			{
				title: "Delete User",
				onClick: this.toggleModal,
				modalType: 'delete',
				class: "text-danger",
				icon: "fa fa-fs fa-trash",
			}
		];

		// Define data table columns and which data fields the values should come from
		// Note we also add the 'Actions' dummy column that utilizes the 'const actions' we defined above
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
			}, {
				// Create a custom, dummy column with clickable icons to edit and delete the row's user
				// Example here:  https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Dummy%20Column&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
				dataField: 'actions',
				isDummyField: true,
				text: 'Actions',
				formatter: (cell, row) => {
					return (
						<TableActions item={ row } actions={ actions } />
					);
				},
				sort: false,
				csvExport: false,
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
											<button type="button" className="btn btn-outline-success" onClick={ (e) => this.toggleModal('create', null) }>
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


					{/* Create user form modal */}
					<div>
						<FormModal
							isOpen={this.state.modalsOpen['create']}
							onRequestClose={ (e) => this.toggleModal('create', null) }
							contentLabel="Create User"
							title="Create User"
							modalAppElement="#users"
							styleOverride={ new Object({width: '40%', left: '35%',}) }
						>
							{/* Define and render the actual create user form  */}
							<CreateForm onClose={ (e) => this.toggleModal('create', null) } onUpdate={ this.fetchUserData } />
						</FormModal>
					</div>
					{/* END Create user form modal */}

					{/* Edit user form modal */}
					<div>
						<FormModal
							isOpen={ this.state.modalsOpen['edit'] }
							onRequestClose={ (e) => this.toggleModal('edit', this.state.user) }
							contentLabel="Edit User"
							title="Edit User"
							modalAppElement="#users"
							styleOverride={ new Object({width: '40%', left: '35%',}) }
						>
							{/* Define and render the actual edit user form  */}
							<EditForm
								onClose={ (e) => this.toggleModal('edit', this.state.user) }
								onUpdate={ this.fetchUserData }
								user={ this.state.user }
							/>
						</FormModal>
					</div>
					{/* END Edit user form modal */}

					{/* Delete user form modal */}
					<div>
						<FormModal
							isOpen={ this.state.modalsOpen['delete'] }
							onRequestClose={ (e) => this.toggleModal('delete', this.state.user) }
							contentLabel="Delete User Confirmation"
							title="Delete User Confirmation"
							modalAppElement="#users"
							styleOverride={ new Object({width: '40%', left: '35%', height: '45%'}) }
						>
							{/* Define and render the actual delete user form  */}
							<DeleteForm
								onClose={ (e) => this.toggleModal('delete', this.state.user) }
								onUpdate={ this.fetchUserData }
								user={ this.state.user }
							/>
						</FormModal>
					</div>
					{/* END Delete user form modal */}

				</div>
		);
	}
	// END render

}
