<?php

// Default route
Route::get('/', function () {
    return redirect( route('home'));
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/get_users', 'UserController@getUsers');
Route::get('/users', 'UserController@index')->name('users');
