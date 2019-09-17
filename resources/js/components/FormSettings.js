// Standard import items
import React from 'react';
import * as Yup from 'yup';


// Define values for use by Formik::initialValues
	initialValuesvalues for use in the
export const initialValues = (props) => {
	// New user; initial vals are empty
	if (props.formType == 'create') {
		return {
			name: '',
			email: '',
			password: '',
			password_confirmation: '',
			roles: [1],
		}
	}
	// Existing user; populate initial vals from user object
	else if (props.formType == 'edit') {
		return {
			name: props.props.user.name,
			email: props.props.user.email,
			password: '',
			password_confirmation: '',
			roles: props.props.user.roles.map( (value, key) => {
				return value.id;
			}),
		}
	}
	// Deleting user; populate ID initial val from user object
	else if (props.formType == 'delete') {
		return {
			id: props.props.user.id,
		}
	}
	// We don't have a Create, Edit, Delete action; return empty object
	else {
		return {}
	}
};

// However, ror now we are going to utilize Laravel validation on the back end...
export const ValidationSchema = () => (
	Yup.object().shape({})
);


// Define the Formik::onSubmit() callback function
export const onSubmit = (props, values, actions, setStateCallback) => {

	// Set default value for end point URL
	let url = '/create_user';
	let verb = 'post';

	// Calculate end point URL based on form type
	// (i.e. create/delete)
	if (props.formType == 'edit') {
		url = '/edit_user/' + props.props.user.id;
		verb = 'put';
	}
	else if (props.formType == 'delete') {
		url = '/delete_user/' + props.props.user.id;
		verb = 'delete';
	}

	// Show the overlay while the ajax request is processing
	props.setStateCallback('showOverlay', true);

	// Submit the request to the server and handle the response
	axios[verb](
		url,
		values,
		{timeout: 1000 * 10},
	)
	.then(response => {
		if (response.data.result) {
			// Store the data/message/etc sent back by the server in the state
			props.setStateCallback('requestResult', response.data.result);
			// Hide the delete user form if successfull
			if (props.formType == 'delete') {
				props.setStateCallback('hideForm', true);
			}
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

				// Define flash message to show user
				data = {
					type: 'danger',
					message: <p className="mb-0"><i className="far fa-frown ml-1">
						</i>&nbsp;&nbsp;Unable to complete request.
						Please correct the problems below.</p>,
				};
			}
		}

		// Define flash message to show user if one hasn't already been set
		if (_.isEmpty(data)) {
			data = {
				type: 'danger',
				message: <p className="mb-0"><i className="far fa-frown ml-1">
					</i>&nbsp;&nbsp;Error:  Unable to process your request at this time.
					Please try again later.</p>,
			};
		}

		// Pass the flash message data to the flash message display component
		props.setStateCallback('requestResult', data);
	})
	.then( () => {
		// Hide the overlay now that everything has been processed
		props.setStateCallback('showOverlay', false);

		// Tell the form we are done submitting
		actions.setSubmitting(false);

		// Show the flash message with the results of the page action
		props.setStateCallback('showFlashMessage', true);
	})
};
