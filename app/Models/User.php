<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'force_password_change',
        'password_changed_at',
        'role',
        'role_level',
        'permissions',
        'photo',
        'social_links',
        'staff_order',
        'is_staff_visible',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'force_password_change' => 'boolean',
            'password_changed_at' => 'datetime',
            'social_links' => 'array',
            'permissions' => 'array',
            'is_staff_visible' => 'boolean',
        ];
    }

    public function needsPasswordChange(): bool
    {
        return $this->force_password_change === true;
    }

    /**
     * Vérifier si l'utilisateur a une permission spécifique
     */
    public function hasPermission(string $permission): bool
    {
        // Master a tous les droits
        if ($this->role_level === 'master') {
            return true;
        }

        // Vérifier dans les permissions
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Vérifier si l'utilisateur est admin ou plus
     */
    public function isAdmin(): bool
    {
        return in_array($this->role_level, ['admin', 'master']);
    }

    /**
     * Vérifier si l'utilisateur est master
     */
    public function isMaster(): bool
    {
        return $this->role_level === 'master';
    }

    /**
     * Scope pour les staff visibles publiquement
     */
    public function scopePublicStaff($query)
    {
        return $query->where('role_level', '!=', 'master')
                     ->where('is_staff_visible', true)
                     ->orderBy('staff_order');
    }

    /**
     * Scope pour tous les staff (admin panel)
     */
    public function scopeStaff($query)
    {
        return $query->whereIn('role_level', ['moderator', 'admin', 'master'])
                     ->orderBy('staff_order');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function eventTicketReservations(): HasMany
    {
        return $this->hasMany(EventTicketReservation::class);
    }
}
