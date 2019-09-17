// Standard import items
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// Formik table related imports
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingOverlay from 'react-loading-overlay';
import isEmpty from 'lodash/isEmpty'

// Our custom components
import FlashMessage from './FlashMessage';
import { initialValues, ValidationSchema, onSubmit } from './FormSettings';

export default class CreateForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// Show/hide Laravel style flash messages
			// regarding actions taken on the page
			showFlashMessage: false,
			// Container for request response data/message/etc
			// sent back by the server
			requestResult: null,
			// Show/hide the form overlay on ajax requests to notify
			// the user activity is happening
			showOverlay: false,
			// Make a copy of the props, so we can pass the values
			// to the Formik callback props below
			props: props,
			// Define what type of form this is
			formType: 'create',
			// Define a callback that child components can call in order
			// to update this component's state
			setStateCallback: this.setStateCallback.bind(this),
		}

		//Bindings
		this.hideFlashMessage = this.hideFlashMessage.bind(this);
	}

	// Actions to take once the component loads
	componentDidMount() {
	}

	// Define a callback that child components can call in order
	// to update this component's state
	setStateCallback(key, value) {
		this.setState({
			[key]: value
		});
	}

	// Hide the the flash message at the top of the modal
	hideFlashMessage() {
			this.setState({
				showFlashMessage: false
			});
	}

	// Examine this.props and this.state and return class response (typical React elements)
	render() {

		// Prepare and return React elements
		return (
			<div>

				{/* Display Laravel style flash messages in response to page actions */}
				<FlashMessage show={ this.state.showFlashMessage } result={ this.state.requestResult } />
				{/* END Display Laravel style flash messages in response to page actions */}

				{/* Form overlay to visually indicate activity is occurring to the user */}
				<LoadingOverlay
					active={this.state.showOverlay}
					spinner
					text='Working...'
				>

				{/* Form block */}
				<div onClick={this.hideFlashMessage}>
					{/* Formik form */}
					<Formik
						initialValues = { initialValues(this.state) }
						validationSchema = { ValidationSchema }
						onSubmit = { (values, actions) => onSubmit(this.state, values, actions) }
					>
						{({ errors, dirty, status, touched, isSubmitting, setFieldValue }) => (

							<Form className="mb-5">

								{/* Form data fields (name, email, password, etc.) */}
								<div className="col-lg-8 col-xl-5">
									<div className="form-group">
										<label htmlFor="name">Name<span className="text-danger">*</span></label>
										<Field
											name="name"
											type="text"
											className={ "form-control " + (errors.name && touched.name ? 'is-invalid' : null) }
											placeholder="User's Name..."
											/>
										<ErrorMessage name="name" component="div" className="invalid-feedback font-weight-bold" />
									</div>

									<div className="form-group">
										<label htmlFor="email">Email<span className="text-danger">*</span></label>
										<Field
											name="email"
											type="email"
											className={ "form-control " + (errors.email && touched.email ? 'is-invalid' : null) }
											placeholder="User's Email..."
											/>
										<ErrorMessage name="email" component="div" className="invalid-feedback font-weight-bold" />
									</div>

									<div className="form-group">
										<label htmlFor="password">Password<span className="text-danger">*</span></label>
										<Field
											name="password"
											type="password"
											className={ "form-control " + (errors.password && touched.password ? 'is-invalid' : null) }
											placeholder="User's Password..."
											/>
										<ErrorMessage name="password" component="div" className="invalid-feedback font-weight-bold" />
									</div>

									<div className="form-group">
										<label htmlFor="password_confirmation">Confirm Password<span className="text-danger">*</span></label>
										<Field
											name="password_confirmation"
											type="password"
											className={ "form-control " + (errors.password_confirmation && touched.password_confirmation ? 'is-invalid' : null) }
											placeholder="Confirm Password..."
											/>
										<ErrorMessage name="password_confirmation" component="div" className="invalid-feedback font-weight-bold" />
									</div>

									<div className="form-group">
										<label htmlFor="roles">User Roles<span className="text-danger">*</span></label>
										<Field
											name="roles"
											component="select"
											className={ "form-control " + (errors.roles && touched.roles ? 'is-invalid' : null) }
											onChange={ (e) =>
												setFieldValue(
													"roles",
													[].slice
														.call(e.target.selectedOptions)
														.map(option => option.value),
													false
												)
											}
											multiple={true}
										>
										{ [ [1, 'Administrator'], [2, 'User'] ].map( (item, index) => {
											return (<option key={ index } value={ item[0] }>{ item[1] }</option>);
										})}
										</Field>
										<ErrorMessage name="roles" component="div" className="invalid-feedback font-weight-bold" />
									</div>

								</div>
								{/* END Form data fields (name, email, password, etc.) */}

								{/* Form submit/close buttons */}
								<div className="form-group ml-3 mt-4">
									<button
										type="submit"
										className="btn btn-outline-success"
										disabled={isSubmitting || !isEmpty(errors)}
										>
										<i className="fa fa-fw fa-plus mr-1"></i> Create User
									</button>

										<button type="button" className="btn btn-outline-secondary ml-3" onClick={this.props.onClose}>
											<i className="fa fa-times-circle mr-1"></i> Close
										</button>

								</div>
								{/* END Form submit/close buttons */}

							</Form>

						)}
						{/* END {({ errors, dirty, status, touched, isSubmitting }) => ( */}
					</Formik>
					{/* END Formik form */}

				</div>
				{/* END Form block */}

				</LoadingOverlay>
				{/* END Form overlay to visually indicate activity is occurring to the user */}

			</div>
		);
	}
}
