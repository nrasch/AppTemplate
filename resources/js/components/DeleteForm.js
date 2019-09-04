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


export default class DeleteForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// Show/hide Laravel style flash messages regarding actions
			// taken on the page
			showFlashMessage: false,
			// Container for request response data/message/etc sent back
			// by the server
			requestResult: null,
			// Show/hide the form overlay on ajax requests to notify the user
			// activity is happening
			showOverlay: false,
			// Show/hide the delete confirmation form, 'cause it looks odd to
			// still have it once the item is deleted
			hideForm: false,
		}

		//Bindings
		this.hideFlashMessage = this.hideFlashMessage.bind(this);
	}

	// Actions to take once the component loads
	componentDidMount() {
	}

	// Hide the the flash message at the top of the modal
	hideFlashMessage() {
			this.setState({
				showFlashMessage: false
			});
	}

	// Examine this.props and this.state and return class response (typical React elements)
	render() {

		// If we choose to utilize form validation client side:
		// const ValidationSchema = Yup.object().shape({
		// 	name: Yup.string()
		// 	.min(2, 'Too Short!')
		// 	.max(50, 'Too Long!')
		// 	.required('The name field is required.')
		// });

		// However, ror now we are going to utilize Laravel validation on the back end...
		const ValidationSchema = Yup.object().shape({
		});

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
						initialValues={{
							id: this.props.user.id,
						}}
						validationSchema={ValidationSchema}
						onSubmit={(values, actions) => {
							// Show the overlay while the ajax request is processing
							this.setState({
								showOverlay: true,
							});

							// Submit the request to the server and handle the response
							axios.delete(
								'/delete_user/' + this.props.user.id,
								values,
								{timeout: 1000 * 10},
							)
							.then(response => {
								if (response.data.result) {
									// Store the data/message/etc sent back by the server in the state
									this.setState({
										requestResult: response.data.result,
										hideForm: true,
									});
								};
							})
							.catch( error => {
								// Init container for flash error message
								let data = {};

								// Is this a Laravel back end validation error?
								if (typeof error.response !== 'undefined') {
									if (error.response.status == '422') {
										// Render the errors on the page's form's elements
										actions.setErrors(error.response.data.errors);

										// Or if for some reason we wanted to set the field errors one-by-one:
										// _.forOwn(error.response.data.errors, function(value, key) {
										// 		actions.setFieldError(
										// 			key, value,
										// 		);
										// });

										// Define flash message to show user
										data = {
											type: 'danger',
											message: <p className="mb-0"><i className="far fa-frown ml-1">
												</i>&nbsp;&nbsp;Unable to complete request.  Please correct the problems below.</p>,
										};
									}
								}

								// Define flash message to show user if one hasn't already been set
								if (_.isEmpty(data)) {
									data = {
										type: 'danger',
										message: <p className="mb-0"><i className="far fa-frown ml-1">
											</i>&nbsp;&nbsp;Error:  Unable to process your request at this time.  Please try again later.</p>,
									};
								}

								// Pass the flash message data to the flash message display component
								this.setState({
									requestResult: data,
								});
							})
							.then( () => {

								// Hide the ajax processing overlay
								this.setState({
									showOverlay: false,
								});

								// Tell the form we are done submitting
								actions.setSubmitting(false);

								// Show the flash message with the results of the page action
								this.setState((state, props) => ({
									showFlashMessage: true,
								}));

							});
						}}
					>
						{({ errors, dirty, status, touched, isSubmitting, setFieldValue }) => (

							<Form className="mb-5" hidden={ this.state.hideForm }>

								{/* Form data fields */}
								<div className="col-12">
									<div className="form-group text-center">
										<div>
											<i className="text-warning fa fa-4x fa-question-circle mb-2" />
										</div>
										<div className="h3">
											<strong>Are you sure?</strong>
										</div>
										<div className="h5">
											You will be unable to recover this user's account!
										</div>
									</div>

									<Field name="id" type="hidden" />
								</div>
								{/* END Form data fields */}

								{/* Form submit/close buttons */}
								<div className="form-group ml-3 mt-4 text-center">
									<button
										type="submit"
										className="btn btn-outline-success"
										disabled={isSubmitting || !isEmpty(errors)}
										>
										<i className="fa fa-fw fa-plus mr-1"></i> Delete User
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
