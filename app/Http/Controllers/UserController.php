<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Requests\UserFormRequest;

class UserController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index()
	{
		return view('users');
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param App\Http\Requests\UserFormRequest $request
	* @return \Illuminate\Http\JsonResponse
	*/
	public function store(UserFormRequest $request)
	{
		// Create the user based on request param values
		$user = User::create($request->all());

		// Assign role(s) to user
		$roles = $request->input('roles') ? $request->input('roles') : [];
		$user->assignRole($roles);

		// Create response to be returned to the view
		$response['result']['type'] = 'success';
		$response['result']['message'] = 'The user was successfully created!';
		$response['data'] = $user->__toString();

		// Return JSON response
		return response()->json($response);
	}

	/**
	* Update the specified resource in storage.
	*
	* @param App\Http\Requests\UserFormRequest $request
	* @param  integer  $id
	* @return \Illuminate\Http\JsonResponse
	*/
	public function update(UserFormRequest $request, $id)
	//public function update(Request $request, $id)
	{
		// Pull the user record from the database
		$user = User::findOrFail($id);

		// Check to see if we're updating the user's password
		if ($request->has('password')) {
			$user->fill($request->all());
		}
		// If the password field is blank skip it; we aren't
		// replacing it with a new one
		else {
				$user->fill($request->except(['password', 'password_confirmation']));
		}

		// Save the user record to the database
		$user->save();

		// Update the user's roles and permissions
		$roles = $request->input('roles') ? $request->input('roles') : [];
		$user->syncRoles($roles);

		// Create response to be returned to the view
		$response['result']['type'] = 'success';
		$response['result']['message'] = 'The user was successfully updated!';
		$response['data'] = $user->__toString();

		// Return JSON response
		return response()->json($response);
	}

	/**
	* Remove the specified resource from storage.
	*
	* @param  integer  $id
	* @return \Illuminate\Http\Response
	*/
	public function destroy($id)
	{
		// Pull the user record from the database
		$user = User::findOrFail($id);

		// Remove the user account from the DB
		$user->delete();

		// Create response to be returned to the view
		$response['result']['type'] = 'success';
		$response['result']['message'] = 'The user was successfully deleted!';
		$response['data'] = $user->__toString();

		// Return JSON response
		return response()->json($response);

	}

	/**
	* Fetch and return a JSON array of Users
	*
	* @return \Illuminate\Http\JsonResponse
	*/
	public function getUsers()
	{
		// Use 'with' option to enable eager loading for the user roles
		$users = User::with('roles')->get();

		// Uncomment line below to simulate no data returned
		//$users = array();

		// We have a sleep here so we can observe the loading overlay in the view
		sleep(1);

		// Return JSON response
		return response()->json(['data' => $users]);
	}
}
