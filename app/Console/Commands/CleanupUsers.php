<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CleanupUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup orphaned users and create a master user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get users that are not staff
        $orphanedUsers = User::where('role_level', 'user')
            ->orWhereNull('role_level')
            ->get();
        
        $this->info('Found ' . count($orphanedUsers) . ' non-staff users');
        
        // Delete non-staff users
        foreach ($orphanedUsers as $user) {
            $this->info('Deleting user: ' . $user->email);
            $user->delete();
        }
        
        // Check if master user exists
        $masterUser = User::where('role_level', 'master')->first();
        
        if (!$masterUser) {
            $this->info('Creating master user...');
            
            // Create master user
            User::create([
                'name' => 'Admin Master',
                'email' => 'master@furntours.local',
                'password' => Hash::make('master123456'),
                'force_password_change' => false,
                'role' => 'Administrateur Master',
                'role_level' => 'master',
                'is_staff_visible' => false,
                'staff_order' => 0,
                'permissions' => [],
                'photo' => null,
                'social_links' => [],
            ]);
            
            $this->info('Master user created!');
            $this->info('Email: master@furntours.local');
            $this->info('Password: master123456');
        } else {
            $this->info('Master user already exists');
        }
        
        $this->info('Cleanup complete!');
    }
}
