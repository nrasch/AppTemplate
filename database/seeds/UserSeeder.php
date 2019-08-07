<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
  /**
  * Run the database seeds.
  *
  * @return void
  */
  public function run()
  {
    // Create an admin user
    $user = User::create([
      'name' => 'Admin',
      'email' => 'admin@admin.com',
      'password' => bcrypt('password')
    ]);
    // Assign the administrator role
    $user->assignRole(['administrator', 'user']);
    $user->save();

    // Create dev/test data for non-production environments
    if (env('APP_ENV') != 'production') {
      // Create N mumber of users
      factory(User::class, 20)->make()->each(function($user) {
        // Assign the user role
        $user->assignRole('user');
        $user->save();
        return true;
      });
    }
  }
}
