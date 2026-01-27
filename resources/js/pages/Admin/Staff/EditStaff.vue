<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Upload } from 'lucide-vue-next';
import { ref } from 'vue';

defineOptions({
    layout: AdminLayout,
});

interface SocialLink {
    platform: string;
    url: string;
}

interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    role_level: 'moderator' | 'admin' | 'master';
    permissions: string[] | null;
    is_staff_visible: boolean;
    photo: string | null;
    social_links: SocialLink[] | null;
    staff_order: number;
}

interface Props {
    staff: Staff;
    availablePermissions?: Record<string, string>;
    availableRoleLevels: string[];
    canEditRoleLevel: boolean;
}

const props = defineProps<Props>();

const form = useForm({
    name: props.staff.name,
    email: props.staff.email,
    role: props.staff.role,
    role_level: props.staff.role_level,
    permissions: props.staff.permissions ?? [],
    is_visible: props.staff.is_staff_visible,
    photo: null as File | null,
    social_links: props.staff.social_links || [],
    staff_order: props.staff.staff_order,
});

const photoPreview = ref<string | null>(
    props.staff.photo ? `/storage/${props.staff.photo}` : null
);

const handlePhotoChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        form.photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const addSocialLink = () => {
    form.social_links.push({ platform: '', url: '' });
};

const removeSocialLink = (index: number) => {
    form.social_links.splice(index, 1);
};

const togglePermission = (permission: string, checked: boolean) => {
    if (checked) {
        if (!form.permissions.includes(permission)) {
            form.permissions.push(permission);
        }
    } else {
        const index = form.permissions.indexOf(permission);
        if (index > -1) {
            form.permissions.splice(index, 1);
        }
    }
};

const regeneratePassword = () => {
    router.post(`/admin/staff/${props.staff.id}/regenerate-password`);
};

const submit = () => {
    form.post(`/admin/staff/${props.staff.id}`, {
        forceFormData: true,
        method: 'put',
    });
};
</script>

<template>
    <div>
        <Head title="Admin - Modifier un membre du staff" />

        <!-- Hero Section -->
        <section class="container mx-auto px-4">
            <div class="mx-auto max-w-3xl mb-8">
                <h1 class="font-bold text-light-blue text-4xl md:text-5xl">
                    Modifier <span class="text-blue">{{ props.staff.name }}</span>
                </h1>
            </div>
        </section>

        <!-- Form Section -->
        <section class="container mx-auto px-4 pb-20">
            <div class="mx-auto max-w-3xl">
                <!-- Message d'erreur global -->
                <div v-if="Object.keys(form.errors).length > 0" class="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-4">
                    <p class="font-semibold text-red-400 mb-2">Erreurs de validation :</p>
                    <ul class="list-disc list-inside text-sm text-red-300 space-y-1">
                        <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
                    </ul>
                </div>

                <form @submit.prevent="submit" class="space-y-6">
                    <div class="rounded-lg border border-light-blue/30 bg-blue/20 p-8">
                        <!-- Photo Upload -->
                        <div class="mb-6">
                            <Label class="mb-2 block text-light-blue">Photo de profil</Label>
                            <div class="flex items-center gap-4">
                                <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-light-blue/30">
                                    <img
                                        v-if="photoPreview"
                                        :src="photoPreview"
                                        alt="Preview"
                                        class="h-full w-full object-cover"
                                    />
                                    <div
                                        v-else
                                        class="h-full w-full bg-gradient-to-br from-[#2c3e50] to-[#34495e] flex items-center justify-center text-4xl text-light-blue font-bold"
                                    >
                                        {{ props.staff.name.charAt(0).toUpperCase() }}
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        @change="handlePhotoChange"
                                        class="bg-[#2c3e50] border-light-blue/30 text-white"
                                    />
                                    <p class="mt-2 text-sm text-gray-400">
                                        Format accepté : JPG, PNG. Taille max : 2MB
                                    </p>
                                    <div v-if="form.errors.photo" class="mt-2 text-sm text-red-400">
                                        {{ form.errors.photo }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Name -->
                        <div class="mb-6">
                            <Label for="name" class="mb-2 block text-light-blue">Nom *</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                required
                                class="bg-[#2c3e50] border-light-blue/30 text-white"
                            />
                            <div v-if="form.errors.name" class="mt-1 text-sm text-red-400">
                                {{ form.errors.name }}
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="mb-6">
                            <Label for="email" class="mb-2 block text-light-blue">Email *</Label>
                            <Input
                                id="email"
                                v-model="form.email"
                                type="email"
                                required
                                class="bg-[#2c3e50] border-light-blue/30 text-white"
                            />
                            <div v-if="form.errors.email" class="mt-1 text-sm text-red-400">
                                {{ form.errors.email }}
                            </div>
                        </div>

                        <!-- Role -->
                        <div class="mb-6">
                            <Label for="role" class="mb-2 block text-light-blue">Rôle *</Label>
                            <Input
                                id="role"
                                v-model="form.role"
                                type="text"
                                required
                                placeholder="Ex: Président, Trésorier, etc."
                                class="bg-[#2c3e50] border-light-blue/30 text-white"
                            />
                            <div v-if="form.errors.role" class="mt-1 text-sm text-red-400">
                                {{ form.errors.role }}
                            </div>
                        </div>

                        <!-- Role Level -->
                        <div class="mb-6">
                            <Label class="mb-3 block text-light-blue">Niveau d'accès *</Label>
                            <div v-if="props.canEditRoleLevel" class="space-y-3">
                                <div v-for="level in props.availableRoleLevels" :key="level" class="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        :id="`level-${level}`"
                                        :value="level"
                                        v-model="form.role_level"
                                        class="cursor-pointer"
                                    />
                                    <Label :for="`level-${level}`" class="cursor-pointer text-white mb-0 capitalize">{{ level }}</Label>
                                </div>
                            </div>
                            <div v-else class="p-3 rounded bg-gray-700/50 text-white capitalize">
                                {{ form.role_level }} (non modifiable)
                            </div>
                            <div v-if="form.errors.role_level" class="mt-1 text-sm text-red-400">
                                {{ form.errors.role_level }}
                            </div>
                        </div>

                        <!-- Permissions (only for non-master) -->
                        <div v-if="form.role_level !== 'master' && props.availablePermissions" class="mb-6">
                            <Label class="mb-3 block text-light-blue">Permissions</Label>
                            <div class="space-y-2">
                                <div
                                    v-for="(label, key) in props.availablePermissions"
                                    :key="key"
                                    class="flex items-center gap-2"
                                >
                                    <input
                                        :id="`permission-${key}`"
                                        type="checkbox"
                                        :checked="form.permissions.includes(key)"
                                        @change="togglePermission(key, ($event.target as HTMLInputElement).checked)"
                                        class="h-4 w-4 rounded border-gray-300 text-light-blue focus:ring-light-blue cursor-pointer"
                                    />
                                    <Label :for="`permission-${key}`" class="text-white cursor-pointer">
                                        {{ label }}
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <!-- Visibility -->
                        <div class="mb-6">
                            <div class="flex items-center gap-2">
                                <input
                                    id="is_visible"
                                    v-model="form.is_visible"
                                    type="checkbox"
                                    :true-value="true"
                                    :false-value="false"
                                    class="h-4 w-4 rounded border-gray-300 text-light-blue focus:ring-light-blue cursor-pointer"
                                />
                                <Label for="is_visible" class="text-light-blue cursor-pointer">
                                    Afficher sur la page publique
                                </Label>
                            </div>
                            <p class="mt-2 text-sm text-gray-400">
                                Note: Les membres avec le rôle Master ne sont jamais affichés publiquement
                            </p>
                        </div>

                        <!-- Order -->
                        <div class="mb-6">
                            <Label for="staff_order" class="mb-2 block text-light-blue">Ordre d'affichage</Label>
                            <Input
                                id="staff_order"
                                v-model.number="form.staff_order"
                                type="number"
                                class="bg-[#2c3e50] border-light-blue/30 text-white"
                            />
                            <p class="mt-1 text-sm text-gray-400">
                                Plus le nombre est petit, plus le membre apparaîtra en premier
                            </p>
                            <div v-if="form.errors.staff_order" class="mt-1 text-sm text-red-400">
                                {{ form.errors.staff_order }}
                            </div>
                        </div>

                        <!-- Social Links -->
                        <div class="mb-6">
                            <div class="mb-3 flex items-center justify-between">
                                <Label class="text-light-blue">Réseaux sociaux</Label>
                                <Button
                                    type="button"
                                    @click="addSocialLink"
                                    size="sm"
                                    class="bg-light-blue/20 text-light-blue hover:bg-light-blue/30"
                                >
                                    <PlusCircle class="h-4 w-4 mr-1" />
                                    Ajouter un réseau
                                </Button>
                            </div>

                            <div
                                v-for="(link, index) in form.social_links"
                                :key="index"
                                class="mb-3 flex gap-3"
                            >
                                <div class="flex-1">
                                    <Input
                                        v-model="link.platform"
                                        type="text"
                                        placeholder="Plateforme (ex: Twitter, Discord)"
                                        class="bg-[#2c3e50] border-light-blue/30 text-white"
                                    />
                                </div>
                                <div class="flex-1">
                                    <Input
                                        v-model="link.url"
                                        type="url"
                                        placeholder="URL du profil"
                                        class="bg-[#2c3e50] border-light-blue/30 text-white"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    @click="removeSocialLink(index)"
                                    size="sm"
                                    class="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>

                            <p v-if="form.social_links.length === 0" class="text-sm text-gray-400">
                                Aucun réseau social ajouté
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4">
                        <Button
                            type="submit"
                            :disabled="form.processing"
                            class="bg-gradient-to-r from-light-blue to-cyan-500 px-8 py-6 text-lg font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue"
                        >
                            {{ form.processing ? 'Mise à jour...' : 'Mettre à jour' }}
                        </Button>
                        <Button
                            type="button"
                            @click="regeneratePassword"
                            class="bg-transparent border-2 border-light-blue text-light-blue hover:bg-light-blue/10"
                        >
                            Régénérer le mot de passe
                        </Button>
                        <Button
                            as="a"
                            href="/admin/staff"
                            type="button"
                            class="bg-transparent border-2 border-gray-500 text-white hover:bg-gray-500/20"
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>
