<?php

// Default route
Route::get('/', function () {
    return redirect( route('home'));
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/charts/get_sales', 'ChartController@getSales');
Route::get('/charts', 'ChartController@index')->name('charts');
