<script setup lang="ts">
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head, useForm } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';

defineOptions({
    layout: AppHeaderLayout,
});

const form = useForm({
    email: '',
    password: '',
});

const submit = () => {
    form.post('/admin/login', {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <div class="relative bg-gradient-to-br from-[#2c3e50] to-[#34495e] py-16">
        <Head title="Connexion Admin" />

        <div class="container mx-auto px-4">
            <div class="mx-auto max-w-md">
                <div class="rounded-lg border border-white/15 bg-[#1f2a3b] p-8 shadow-2xl shadow-black/30">
                    <div class="mb-6 text-center">
                        <h1 class="text-3xl font-semibold text-cyan-200">Connexion Admin</h1>
                        <p class="mt-2 text-sm text-cyan-100/80">Accéder à la console d'administration</p>
                    </div>

                    <Form class="flex flex-col gap-6" @submit.prevent="submit">
                        <div class="grid gap-6">
                            <div class="grid gap-2">
                                <Label for="email" class="text-cyan-50">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    v-model="form.email"
                                    required
                                    autofocus
                                    autocomplete="email"
                                    placeholder="admin@furntours.com"
                                    class="border-cyan-300/30 bg-[#1b2433] text-white focus:border-cyan-300 focus:ring-cyan-300/60"
                                />
                                <InputError :message="form.errors.email" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="password" class="text-cyan-50">Mot de passe</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    v-model="form.password"
                                    required
                                    autocomplete="current-password"
                                    placeholder="••••••••"
                                    class="border-cyan-300/30 bg-[#1b2433] text-white focus:border-cyan-300 focus:ring-cyan-300/60"
                                />
                                <InputError :message="form.errors.password" />
                            </div>
                        </div>

                        <Button type="submit" class="mt-2 w-full bg-gradient-to-r from-cyan-300 to-light-blue text-[#0f172a] hover:from-cyan-200 hover:to-cyan-300" :disabled="form.processing">
                            <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
                            <span v-else>Se connecter</span>
                        </Button>
                    </Form>

                    <p class="mt-6 text-center text-xs text-cyan-50/70">
                        💡 Astuce : Utilisez le code Konami sur les pages publiques
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
