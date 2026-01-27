<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, List, PlusCircle, Users, User, ShoppingBag, Settings, ClipboardList, FileText } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

const page = usePage();
const user = computed(() => page.props.auth?.user);
const mobileOpen = ref(false);

const currentUrl = computed(() => page.url || '');

const isActive = (path: string) => {
    // Consider both exact match and sub-routes
    return currentUrl.value === path || currentUrl.value.startsWith(path + '/');
};

// Fermer le menu mobile quand on change de page
watch(currentUrl, () => {
    mobileOpen.value = false;
});

const userInitials = computed(() => {
    if (!user.value?.name) return 'U';
    return user.value.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
});

const canManageUsers = computed(() => {
    if (!user.value) return false;
    // Master can always manage users
    if (user.value.role_level === 'master') return true;
    // Others need the manage_users permission
    return user.value.permissions?.includes('manage_users') ?? false;
});

const canManageSettings = computed(() => {
    if (!user.value) return false;
    // Master can always manage settings
    if (user.value.role_level === 'master') return true;
    // Others need the manage_settings permission
    return user.value.permissions?.includes('manage_settings') ?? false;
});

const canManageOrders = computed(() => {
    if (!user.value) return false;
    // Master can always manage orders
    if (user.value.role_level === 'master') return true;
    // Others need the manage_orders permission
    return user.value.permissions?.includes('manage_orders') ?? false;
});

const canManageInvoices = computed(() => {
    if (!user.value) return false;
    // Master can always manage invoices
    if (user.value.role_level === 'master') return true;
    // Others need the manage_invoices permission
    return user.value.permissions?.includes('manage_invoices') ?? false;
});

const logout = () => {
    router.post('/admin/logout');
};

const toggleMobile = () => {
    mobileOpen.value = !mobileOpen.value;
};
</script>

<template>
    <header class="sticky top-0 z-50 w-full border-b-2 border-cyan-400/60 bg-[#111827]/80 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.3)] will-change-transform">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <!-- Logo / Titre Admin -->
                <div class="flex items-center gap-8">
                    <a href="/admin" class="flex items-center gap-2">
                        <span class="text-2xl font-bold text-light-blue">FurTours</span>
                        <span class="rounded-full bg-yellow/20 px-3 py-1 text-xs font-semibold text-yellow">ADMIN</span>
                    </a>

                    <!-- Navigation -->
                    <nav class="hidden md:flex items-center gap-4">
                        <Button
                            as="a"
                            href="/admin/furmeets"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/furmeets')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <List class="h-4 w-4 mr-2" />
                            FurMeets
                        </Button>

                        <Button
                            v-if="canManageUsers"
                            as="a"
                            href="/admin/staff"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/staff')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <Users class="h-4 w-4 mr-2" />
                            Gérer le Staff
                        </Button>

                        <Button
                            v-if="canManageSettings"
                            as="a"
                            href="/admin/settings"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/settings')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <Settings class="h-4 w-4 mr-2" />
                            Paramètres
                        </Button>
                        <Button
                            v-if="canManageOrders"
                            as="a"
                            href="/admin/orders"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/orders')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <ClipboardList class="h-4 w-4 mr-2" />
                            Commandes
                        </Button>

                        <Button
                            v-if="canManageInvoices"
                            as="a"
                            href="/admin/invoices"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/invoices')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <FileText class="h-4 w-4 mr-2" />
                            Factures
                        </Button>

                        <Button
                            as="a"
                            href="/admin/products"
                            variant="ghost"
                            size="sm"
                            :class="[
                                'hover:text-light-blue hover:bg-light-blue/10',
                                isActive('/admin/products')
                                    ? 'text-yellow bg-yellow/10'
                                    : 'text-gray-300'
                            ]"
                        >
                            <ShoppingBag class="h-4 w-4 mr-2" />
                            Produits
                        </Button>
                    </nav>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-4">
                    <!-- Mobile menu toggle -->
                    <button
                        class="md:hidden rounded-lg border border-light-blue/30 bg-blue/20 p-2 text-light-blue hover:bg-blue/30"
                        @click="toggleMobile"
                        aria-label="Ouvrir le menu"
                    >
                        <List class="h-5 w-5" />
                    </button>

                    <a 
                        href="/"
                        class="text-sm text-gray-400 hover:text-light-blue transition-colors"
                    >
                        Retour au site
                    </a>

                    <!-- User Menu -->
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button class="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-light-blue/50 transition-all">
                                <Avatar class="h-9 w-9 border-2 border-light-blue/40">
                                        <AvatarImage v-if="user?.avatar" :src="user.avatar" :alt="user?.name" />
                                        <AvatarFallback class="bg-gradient-to-br from-light-blue to-cyan-500 text-[#0f172a] font-semibold">
                                            {{ userInitials }}
                                        </AvatarFallback>
                                    </Avatar>
                                <span class="hidden md:inline text-sm font-medium text-gray-200">
                                    {{ user?.name }}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <DropdownMenuLabel class="font-normal">
                                <div class="flex flex-col space-y-1">
                                    <p class="text-sm font-medium">{{ user?.name }}</p>
                                    <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem as-child>
                                <a href="/admin/profile" class="flex items-center cursor-pointer">
                                    <User class="mr-2 h-4 w-4" />
                                    <span>Mon profil</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="logout" class="text-red-600 focus:text-red-600 cursor-pointer">
                                <LogOut class="mr-2 h-4 w-4" />
                                <span>Déconnexion</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <!-- Mobile navigation -->
            <div v-if="mobileOpen" class="md:hidden pb-4">
                <div class="mt-2 space-y-2 rounded-lg border border-light-blue/30 bg-blue/20 p-3">
                    <a
                        href="/admin/furmeets"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/furmeets') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <List class="h-4 w-4" />
                        FurMeets
                    </a>

                    
                    <a
                        v-if="canManageSettings"
                        href="/admin/settings"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/settings') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <Settings class="h-4 w-4" />
                        Paramètres
                    </a>
                    <a
                        v-if="canManageUsers"
                        href="/admin/staff"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/staff') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <Users class="h-4 w-4" />
                        Gérer le Staff
                    </a>

                    <a
                        v-if="canManageOrders"
                        href="/admin/orders"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/orders') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <ClipboardList class="h-4 w-4" />
                        Commandes
                    </a>

                    <a
                        v-if="canManageInvoices"
                        href="/admin/invoices"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/invoices') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <FileText class="h-4 w-4" />
                        Factures
                    </a>

                    <a
                        href="/admin/products"
                        :class="[
                            'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium',
                            isActive('/admin/products') ? 'text-yellow bg-yellow/10' : 'text-gray-200 hover:bg-light-blue/10'
                        ]"
                    >
                        <ShoppingBag class="h-4 w-4" />
                        Produits
                    </a>
                </div>
            </div>
        </div>
    </header>
</template>
