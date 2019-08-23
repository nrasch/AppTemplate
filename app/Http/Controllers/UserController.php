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

		// Create response to view
		$response['result']['type'] = 'success';
    $response['result']['message'] = 'The user was successfuly created!';
    $response['data'] = $user->__toString();

		// Return JSON response
    return response()->json($response);
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  \App\User  $user
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request, User $user)
	{
		//
	}

	/**
	* Remove the specified resource from storage.
	*
	* @param  \App\User  $user
	* @return \Illuminate\Http\Response
	*/
	public function destroy(User $user)
	{
		//
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

	/**
	* Fetch and return a JSON array of Roles
	*
	* @return \Illuminate\Http\JsonResponse
	*/
	public function getRoles()
	{
		// Use 'with' option to enable eager loading for the user roles
		$roles = Role::get();

		// Uncomment line below to simulate no data returned
		//$roles = array();

		// We have a sleep here so we can observe the loading overlay in the view
		sleep(1);

		// Return JSON response
		return response()->json(['data' => $roles]);
	}

}
