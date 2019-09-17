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
			// Make a copy of the props, so we can pass the values
			// to the Formik callback props below
			props: props,
			// Define what type of form this is
			formType: 'delete',
			// Define a callback that child components can call in order
			// to update this component's state
			setStateCallback: this.setStateCallback.bind(this),
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
						initialValues = { initialValues(this.state) }
						validationSchema={ValidationSchema}
						onSubmit = { (values, actions) => onSubmit(this.state, values, actions) }
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
