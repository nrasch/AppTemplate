<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserFormRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return Auth::user()->can('manage_users');
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		// Define general rules that will apply to all request types
		$rules = [
			'name' => 'required',
			'roles' => 'required',
		];

		// Creating a new record
		if ($this->isMethod('post')) {
			$rules = array_merge($rules,
				[
					'email' => 'required|email|unique:users,email',
					'password' => 'required|confirmed',
				]
			);
		}
		// Updating an existing record
		elseif ($this->isMethod('put')) {
			$rules = array_merge($rules,
				[
					'email' => [
							'required',
							'email',
							Rule::unique('users')->ignore($this->route('id')),
					],
					'password' => 'sometimes|confirmed',
				]
			);
		}
		// Return false for any other method
		else {
			return false;
		}

		return $rules;
	}
}
