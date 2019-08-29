<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
		use Notifiable, HasRoles;

		/**
		 * The attributes that are mass assignable.
		 *
		 * @var array
		 */
		protected $fillable = [
				'name', 'email', 'password',
		];

		/**
		 * The attributes that should be hidden for arrays.
		 *
		 * @var array
		 */
		protected $hidden = [
				'password', 'remember_token',
		];

		/**
		 * The attributes that should be cast to native types.
		 *
		 * @var array
		 */
		protected $casts = [
				'email_verified_at' => 'datetime',
		];

		/**
		 * Hash the user's password
		 * https://laravel.com/docs/5.8/eloquent-mutators#defining-a-mutator
		 *
		 * @param $value
		 */
		public function setPasswordAttribute($value)
		{
				if ($value) {
						$this->attributes['password'] = app('hash')->needsRehash($value) ? Hash::make($value) : $value;
				}
		}
}
