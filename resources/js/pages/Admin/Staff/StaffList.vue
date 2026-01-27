<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle, Pencil, Trash2, Shield, ShieldCheck, Crown, Copy, X, User } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';

defineOptions({
    layout: AdminLayout,
});

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    role_level: 'user' | 'moderator' | 'admin' | 'master';
    permissions: string[] | null;
    is_staff_visible: boolean;
    photo: string | null;
    social_links: Array<{ platform: string; url: string }> | null;
    staff_order: number;
}

interface Props {
    staff: Staff[];
    availablePermissions?: Record<string, string>;
    userLevel: 'user' | 'moderator' | 'admin' | 'master';
}

const props = defineProps<Props>();
const page = usePage();

const { success, error } = useNotification();

const showPasswordModal = ref(false);
const temporaryPassword = ref<string | null>(null);
const passwordCopied = ref(false);

// Récupérer le message flash et le mot de passe temporaire
const flash = computed(() => page.props.flash as any);

watch(
  () => page.props.flash,
  (flash: any) => {
    if (flash?.success) {
      success('Succès', flash.success);
    }
    if (flash?.error) {
      error('Erreur', flash.error);
    }
  },
  { immediate: true, deep: true }
);

watch(
    () => flash.value?.temporaryPassword,
    (temp) => {
        if (temp) {
            temporaryPassword.value = temp as string;
            showPasswordModal.value = true;
        }
    },
    { immediate: true }
);

const deleteStaff = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre du staff ?')) {
        router.delete(`/admin/staff/${id}`);
    }
};

const copyPassword = () => {
    if (temporaryPassword.value) {
        navigator.clipboard.writeText(temporaryPassword.value);
        passwordCopied.value = true;
        setTimeout(() => {
            passwordCopied.value = false;
        }, 2000);
    }
};

const closePasswordModal = () => {
    showPasswordModal.value = false;
    temporaryPassword.value = null;
};

const getRoleLevelIcon = (roleLevel: string) => {
    switch (roleLevel) {
        case 'master': return Crown;
        case 'admin': return ShieldCheck;
        case 'moderator': return Shield;
        case 'user': return User;
        default: return User;
    }
};

const getRoleLevelColor = (roleLevel: string) => {
    switch (roleLevel) {
        case 'master': return 'text-purple-400';
        case 'admin': return 'text-blue-400';
        case 'moderator': return 'text-green-400';
        case 'user': return 'text-gray-400';
        default: return 'text-gray-400';
    }
};

const getRoleLevel = (roleLevel: string | null | undefined): number => {
    switch (roleLevel) {
        case 'master': return 4;
        case 'admin': return 3;
        case 'moderator': return 2;
        case 'user': return 1;
        default: return 0;
    }
};

const canEdit = (member: Staff): boolean => {
    const userRoleLevel = getRoleLevel(props.userLevel);
    // Master (level 4) can edit everyone
    if (userRoleLevel === 4) return true;
    // Others can only edit users with lower role level
    return getRoleLevel(member.role_level) < userRoleLevel;
};
</script>

<template>
    <div>
        <Head title="Admin - Gestion du Staff" />

        <NotificationContainer />

        <!-- Modal Mot de passe temporaire -->
        <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div class="bg-[#2c3e50] rounded-lg border border-light-blue/30 p-8 max-w-md w-full mx-4">
                <!-- Close Button -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-light-blue">Mot de passe temporaire</h2>
                    <button @click="closePasswordModal" class="text-gray-400 hover:text-white">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <!-- Message -->
                <p class="text-gray-300 mb-6">
                    Le nouveau membre du staff doit utiliser ce mot de passe temporaire pour se connecter. 
                    Il sera invité à le changer lors de sa première connexion.
                </p>

                <!-- Password Display -->
                <div class="bg-blue/30 border border-light-blue/30 rounded-lg p-4 mb-6">
                    <p class="text-xs text-gray-400 mb-2">Mot de passe temporaire :</p>
                    <div class="flex items-center gap-2">
                        <code class="text-lg font-mono text-light-blue flex-1">{{ temporaryPassword }}</code>
                        <button
                            @click="copyPassword"
                            class="p-2 hover:bg-light-blue/20 rounded transition-colors"
                            :title="passwordCopied ? 'Copié!' : 'Copier'"
                        >
                            <Copy 
                                class="h-5 w-5" 
                                :class="passwordCopied ? 'text-green-400' : 'text-light-blue'"
                            />
                        </button>
                    </div>
                    <p v-if="passwordCopied" class="text-xs text-green-400 mt-2">
                        Copié dans le presse-papiers!
                    </p>
                </div>

                <!-- Close Button -->
                <Button
                    @click="closePasswordModal"
                    class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#2c3e50] font-semibold hover:shadow-lg hover:shadow-light-blue/30"
                >
                    Fermer
                </Button>
            </div>
        </div>

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl mb-8">
                <div class="flex items-center justify-between">
                    <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                        Gestion du <span class="text-blue">Staff</span>
                    </h1>
                    <Button
                        as="a"
                        href="/admin/staff/create"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30"
                    >
                        <PlusCircle class="h-5 w-5 mr-2" />
                        Ajouter un membre
                    </Button>
                </div>
            </div>
        </section>

        <!-- Staff Grid -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-7xl">
                <!-- Grid -->
                 
                <div v-if="props.staff.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="member in props.staff"
                        :key="member.id"
                        class="rounded-lg border border-light-blue/30 bg-blue/20 p-6 hover:border-light-blue/50 transition-all"
                    >
                        <!-- Photo -->
                        <div class="mb-4 flex justify-center relative">
                            <div class="h-32 w-32 overflow-visible">
                                <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-light-blue/30 relative">
                                    <img
                                        v-if="member.photo"
                                        :src="`/storage/${member.photo}`"
                                        :alt="member.name"
                                        class="h-full w-full object-cover"
                                    />
                                    <div
                                        v-else
                                        class="h-full w-full bg-gradient-to-br from-[#2c3e50] to-[#34495e] flex items-center justify-center text-4xl text-light-blue font-bold"
                                    >
                                        {{ member.name.charAt(0).toUpperCase() }}
                                    </div>
                                </div>

                                <!-- Role Badge (positioned outside) -->
                                <div v-if="member.role_level" class="absolute -top-2 -right-2 bg-[#2c3e50] rounded-full p-1.5 border-2 border-light-blue">
                                    <component
                                        :is="getRoleLevelIcon(member.role_level)"
                                        :class="[`h-5 w-5`, getRoleLevelColor(member.role_level)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="text-center mb-4">
                            <h3 class="text-xl font-bold text-white mb-1">
                                {{ member.name }}
                            </h3>
                            <p class="text-light-blue font-medium">
                                {{ member.role }}
                            </p>

                            <!-- Role Level Badge -->
                            <div class="mt-2">
                                <span
                                    v-if="member.role_level === 'master'"
                                    class="inline-block text-xs font-bold px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                >
                                    Master
                                </span>
                                <span
                                    v-else-if="member.role_level === 'admin'"
                                    class="inline-block text-xs font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                >
                                    Admin
                                </span>
                                <span
                                    v-else-if="member.role_level === 'moderator'"
                                    class="inline-block text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"
                                >
                                    Moderator
                                </span>
                                <span
                                    v-else
                                    class="inline-block text-xs font-bold px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                >
                                    User
                                </span>
                            </div>

                            <!-- Email -->
                            <div class="mt-2 text-sm text-gray-400">
                                {{ member.email }}
                            </div>

                            <!-- Order -->
                            <div class="mt-1 text-xs text-gray-500">
                                Ordre: {{ member.staff_order ?? 0 }}
                            </div>

                            <!-- Visibility -->
                            <div v-if="member.is_staff_visible" class="mt-2">
                                <span class="inline-block text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                    Visible publiquement
                                </span>
                            </div>
                        </div>

                        <!-- Permissions -->
                        <div v-if="member.role_level !== 'master' && member.permissions && member.permissions.length > 0" class="mb-4">
                            <p class="text-xs font-semibold text-light-blue mb-2">Permissions:</p>
                            <div class="flex flex-wrap gap-1">
                                <span
                                    v-for="perm in member.permissions"
                                    :key="perm"
                                    class="inline-block text-xs px-2 py-1 rounded bg-light-blue/20 text-light-blue"
                                >
                                    {{ perm }}
                                </span>
                            </div>
                        </div>

                        <!-- Social Links -->
                        <div v-if="member.social_links && member.social_links.length > 0" class="mb-4">
                            <div class="flex flex-wrap justify-center gap-2">
                                <a
                                    v-for="(link, index) in member.social_links"
                                    :key="index"
                                    :href="link.url"
                                    target="_blank"
                                    class="rounded-md bg-light-blue/20 px-3 py-1 text-xs text-light-blue hover:bg-light-blue/30 transition-colors"
                                >
                                    {{ link.platform }}
                                </a>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div v-if="canEdit(member)" class="flex gap-2 mt-4">
                            <Button
                                as="a"
                                :href="`/admin/staff/${member.id}/edit`"
                                size="sm"
                                class="flex-1 bg-blue/30 text-light-blue hover:bg-blue/50 border border-light-blue/30"
                            >
                                <Pencil class="h-4 w-4 mr-1" />
                                Modifier
                            </Button>
                            <form
                                @submit.prevent="deleteStaff(member.id)"
                                class="flex-1"
                            >
                                <Button
                                    type="submit"
                                    size="sm"
                                    class="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                                >
                                    <Trash2 class="h-4 w-4 mr-1" />
                                    Supprimer
                                </Button>
                            </form>
                        </div>
                        <div v-else class="mt-4 text-center text-sm text-gray-500">
                            <Shield class="h-4 w-4 inline mr-1" />
                            Protection du rang
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="rounded-lg border-2 border-dashed border-muted p-12 text-center">
                    <p class="mb-4 text-lg text-muted-foreground">
                        Aucun membre du staff pour le moment.
                    </p>
                    <Button
                        as="a"
                        href="/admin/staff/create"
                        class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                    >
                        Ajouter le premier membre
                    </Button>
                </div>
            </div>
        </section>
    </div>
</template>
