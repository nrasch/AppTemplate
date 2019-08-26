<?php

// Default route
Route::get('/', function () {
    return redirect( route('home'));
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/get_users', 'UserController@getUsers');
Route::post('/create_user', 'UserController@store');
Route::put('/edit_user/{id}', 'UserController@update');
Route::delete('/delete_user/{id}', 'UserController@destroy');
Route::get('/users', 'UserController@index')->name('users');
