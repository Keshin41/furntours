<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CartButton from '@/components/CartButton.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { getInitials } from '@/composables/useInitials';
import { toUrl, urlIsActive } from '@/lib/utils';
import { acceuil, explication, furmeets, rcs, contact } from '@/routes';
import boutique from '@/routes/boutique';
import type { BreadcrumbItem, NavItem } from '@/types';
import { InertiaLinkProps, Link, usePage } from '@inertiajs/vue3';
import { BookOpen, ShoppingCart, Menu, Search } from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth);

const isCurrentRoute = computed(
    () => (url: NonNullable<InertiaLinkProps['href']>) => {
        const targetUrl = toUrl(url);
        const currentUrl = page.url;
        
        if (currentUrl.startsWith('/boutique/panier') && targetUrl === '/boutique') return true;

        if (targetUrl === '/') return currentUrl === '/';
        return currentUrl.startsWith(targetUrl);
    },
);

const activeItemStyles = computed(
    () => (url: NonNullable<InertiaLinkProps['href']>) =>
        isCurrentRoute.value(toUrl(url))
            ? 'text-yellow font-semibold'
            : 'text-blue hover:text-blue',
);

const mainNavItems: NavItem[] = [
    {
        title: 'Acceuil',
        href: acceuil(),
    },
    {
        title: 'Boutique',
        href: boutique.index(),
    },
    {
        title: 'C\'est quoi un furry?',
        href: explication(),
    },
    {
        title: 'Furmeets',
        href: furmeets(),
    },
    {
        title: 'Contact',
        href: contact(),
    },
];
</script>

<template>
    <div class="sticky top-0 z-50 w-full bg-[#111827]/80 backdrop-blur-md will-change-transform">
        <div class="relative border-b-2 border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <div class="mx-auto flex h-22 items-center justify-center px-4 md:max-w-7xl">
                <!-- Mobile Menu (affiché à gauche sur mobile) -->
                <div class="absolute left-4 lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-9 w-9"
                            >
                                <Menu class="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" class="w-[300px] p-6">
                            <SheetTitle class="sr-only"
                                >Navigation Menu</SheetTitle
                            >
                            <SheetHeader class="flex justify-start text-left">
                                <AppLogoIcon
                                    class="size-6 fill-current text-black dark:text-white"
                                />
                            </SheetHeader>
                            <div
                                class="flex h-full flex-1 flex-col justify-between space-y-4 py-6"
                            >
                                <nav class="-mx-3 space-y-1">
                                    <Link
                                        v-for="item in mainNavItems"
                                        :key="item.title"
                                        :href="item.href"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                        :class="activeItemStyles(item.href)"
                                    >
                                        <component
                                            v-if="item.icon"
                                            :is="item.icon"
                                            class="h-5 w-5"
                                        />
                                        {{ item.title }}
                                    </Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <!-- Cart Button (Mobile) -->
                <div class="absolute right-4 lg:hidden">
                    <CartButton />
                </div>

                <!-- Desktop Menu -->
                <div class="hidden h-full lg:flex lg:items-center lg:gap-8 lg:flex-1 lg:justify-between">
                    <div class="flex items-center gap-8">
                        <!-- Logo & Titre -->
                        <div class="flex flex-col">
                            <span class="text-2xl font-bold text-blue">Fur N Tours</span>
                            <span class="text-s text-light-blue">Association</span>
                        </div>

                        <!-- Navigation -->
                        <NavigationMenu class="flex h-full items-stretch">
                            <NavigationMenuList
                                class="flex h-full items-stretch space-x-2"
                            >
                                <NavigationMenuItem
                                    v-for="(item, index) in mainNavItems"
                                    :key="index"
                                    class="relative flex h-full items-center"
                                >
                                    <Link
                                        :class="[
                                            activeItemStyles(item.href),
                                            'h-9 cursor-pointer px-3 transition-colors relative pb-2',
                                            !isCurrentRoute(item.href) ? 'hover-underline-blue' : '',
                                        ]"
                                        :href="item.href"
                                    >
                                        <component
                                            v-if="item.icon"
                                            :is="item.icon"
                                            class="mr-2 h-4 w-4"
                                        />
                                        {{ item.title }}
                                        
                                        <!-- Ligne pour route active (jaune) -->
                                        <span
                                            v-if="isCurrentRoute(item.href)"
                                            class="absolute bottom-0 left-0 h-0.5 w-full bg-yellow"
                                        ></span>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <!-- Cart Button (Desktop) -->
                    <CartButton />
                </div>
            </div>
        </div>

        <div
            v-if="props.breadcrumbs.length > 1"
            class="flex w-full border-b border-sidebar-border/70"
        >
            <div
                class="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl"
            >
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </div>
        </div>
    </div>
</template>
