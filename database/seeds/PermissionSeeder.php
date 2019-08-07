<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      // Clear out any cached configurations for the application, so that
      // Laravel uses the current values for the configuration
      Artisan::call('cache:clear');

      // From the Spatie docs:  If you manipulate permission/role data
      // directly in the database instead of calling the supplied methods,
      // then you will not see the changes reflected in the application
      //  unless you manually reset the cache.
      //
      // We are using the supplied methods, but we are going to clear it anyhow just to be on the safe side.
      app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

      // Create the permission(s)
      Permission::create(['name' => 'manage_users']);
    }
}
