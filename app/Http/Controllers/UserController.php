<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

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
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{
		//
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{
		//
	}

	/**
	* Display the specified resource.
	*
	* @param  \App\User  $user
	* @return \Illuminate\Http\Response
	*/
	public function show(User $user)
	{
		//
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  \App\User  $user
	* @return \Illuminate\Http\Response
	*/
	public function edit(User $user)
	{
		//
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
	* @param  \App\User  $user
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
