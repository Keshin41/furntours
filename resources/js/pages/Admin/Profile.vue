<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/InputError.vue';
import NotificationContainer from '@/components/NotificationContainer.vue';
import { useNotification } from '@/composables/useNotification';
import { LoaderCircle, User, Lock, Mail, Image } from 'lucide-vue-next';
import { watch, ref } from 'vue';
import { useForm, Head, usePage } from '@inertiajs/vue3';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        photo?: string | null;
    };
}

const props = defineProps<Props>();
const page = usePage();
const { success, error } = useNotification();

const profileForm = useForm({
    name: props.user.name,
    email: props.user.email,
    photo: null as File | null,
});


const avatarPreview = ref<string | null>("/storage/" + props.user.photo);


const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

// Watch for flash success messages
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

const updateProfile = () => {
    profileForm.put('/admin/profile', {
        preserveScroll: true,
    });
};

const handleAvatarChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        profileForm.photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const updateAvatar = () => {
    profileForm.post('/admin/profile', {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
            profileForm.reset();
            avatarPreview.value = "/storage/" + props.user.photo;
        },
    });
};

const updatePassword = () => {
    passwordForm.put('/admin/profile', {
        preserveScroll: true,
        onSuccess: () => {
            passwordForm.reset();
        },
    });
};
</script>

<template>
    <AdminLayout>
        <Head title="Mon Profil" />

        <NotificationContainer />

        <div class="space-y-6">
            <!-- Page Header -->
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Gérez vos informations personnelles et votre mot de passe
                </p>
            </div>

            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Profile Picture Card -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Image class="h-5 w-5 text-light-blue" />
                            Photo de profil
                        </CardTitle>
                        <CardDescription>
                            Téléchargez une nouvelle photo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="updateAvatar" class="space-y-4">
                            <div class="flex justify-center">
                                <div
                                    v-if="avatarPreview"
                                    class="h-32 w-32 overflow-hidden rounded-full border-2 border-light-blue bg-gray-200"
                                >
                                    <img :src="avatarPreview" alt="Preview" class="h-full w-full object-cover" />
                                </div>
                                <div
                                    v-else
                                    class="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-light-blue bg-gray-100 dark:bg-gray-800"
                                >
                                    <Image class="h-8 w-8 text-light-blue/50" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="photo">Sélectionner une image</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    @change="handleAvatarChange"
                                    class="cursor-pointer"
                                />
                                <InputError :message="profileForm.errors.photo" />
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, GIF jusqu'à 5MB
                                </p>
                            </div>

                            <Button
                                type="submit"
                                class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#0f172a] hover:from-cyan-300 hover:to-light-blue"
                                :disabled="profileForm.processing || !profileForm.photo"
                            >
                                <LoaderCircle v-if="profileForm.processing" class="mr-2 h-4 w-4 animate-spin" />
                                Mettre à jour
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <!-- Profile Information Card -->
                <div class="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <User class="h-5 w-5 text-light-blue" />
                            Informations du profil
                        </CardTitle>
                        <CardDescription>
                            Mettez à jour votre nom et votre adresse email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <div class="space-y-2">
                                <Label for="name">Nom</Label>
                                <div class="relative">
                                    <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        v-model="profileForm.name"
                                        type="text"
                                        required
                                        class="pl-10"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <InputError :message="profileForm.errors.name" />
                            </div>

                            <div class="space-y-2">
                                <Label for="email">Email</Label>
                                <div class="relative">
                                    <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        v-model="profileForm.email"
                                        type="email"
                                        required
                                        class="pl-10"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <InputError :message="profileForm.errors.email" />
                            </div>

                            <Button
                                type="submit"
                                class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#0f172a] hover:from-cyan-300 hover:to-light-blue"
                                :disabled="profileForm.processing"
                            >
                                <LoaderCircle v-if="profileForm.processing" class="mr-2 h-4 w-4 animate-spin" />
                                Mettre à jour le profil
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <!-- Change Password Card -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Lock class="h-5 w-5 text-light-blue" />
                            Changer le mot de passe
                        </CardTitle>
                        <CardDescription>
                            Assurez-vous d'utiliser un mot de passe long et sécurisé
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="updatePassword" class="space-y-4">
                            <div class="space-y-2">
                                <Label for="current_password">Mot de passe actuel</Label>
                                <Input
                                    id="current_password"
                                    v-model="passwordForm.current_password"
                                    type="password"
                                    autocomplete="current-password"
                                    placeholder="••••••••"
                                />
                                <InputError :message="passwordForm.errors.current_password" />
                            </div>

                            <div class="space-y-2">
                                <Label for="password">Nouveau mot de passe</Label>
                                <Input
                                    id="password"
                                    v-model="passwordForm.password"
                                    type="password"
                                    autocomplete="new-password"
                                    placeholder="••••••••"
                                />
                                <InputError :message="passwordForm.errors.password" />
                            </div>

                            <div class="space-y-2">
                                <Label for="password_confirmation">Confirmer le nouveau mot de passe</Label>
                                <Input
                                    id="password_confirmation"
                                    v-model="passwordForm.password_confirmation"
                                    type="password"
                                    autocomplete="new-password"
                                    placeholder="••••••••"
                                />
                                <InputError :message="passwordForm.errors.password_confirmation" />
                            </div>

                            <Button
                                type="submit"
                                class="w-full bg-gradient-to-r from-light-blue to-cyan-500 text-[#0f172a] hover:from-cyan-300 hover:to-light-blue"
                                :disabled="passwordForm.processing"
                            >
                                <LoaderCircle v-if="passwordForm.processing" class="mr-2 h-4 w-4 animate-spin" />
                                Changer le mot de passe
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
