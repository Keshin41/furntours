<script setup lang="ts">
import AuthSimpleLayout from '@/layouts/auth/AuthSimpleLayout.vue';
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';
import { Head, useForm, usePage, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { computed, watch } from 'vue';
import { CheckCircle, AlertCircle, Lock } from 'lucide-vue-next';
import { useNotification } from '@/composables/useNotification';
import NotificationContainer from '@/components/NotificationContainer.vue';

defineOptions({
  layout:  AppHeaderLayout,
});
const page = usePage();
const { success, error } = useNotification();

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

const form = useForm({
  current_password: '',
  password: '',
  password_confirmation: '',
});

const submit = () => {
  form.post('/change-password', {
    preserveScroll: true,
  });
};

const logout = () => {
  router.post('/logout');
};
</script>

<template>
  <div>
    <Head title="Changer le mot de passe" />

    <!-- Header -->
    <section class="bg-gradient-to-b from-dark to-[#1a2332] py-10">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-xl text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-light-blue">Sécurité du compte</h1>
          <p class="mt-3 text-gray-300">
            Pour des raisons de sécurité, vous devez mettre à jour votre mot de passe.
          </p>
        </div>
      </div>
    </section>

    <NotificationContainer />

    <!-- Form -->
    <section class="bg-dark py-8">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-xl rounded-lg border border-light-blue/30 bg-dark/60 p-6">
          <div class="mb-6 flex items-center gap-2 text-gray-300">
            <Lock class="h-5 w-5" />
            <span>Votre nouveau mot de passe doit être robuste (8+ caractères).</span>
          </div>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="current_password" class="mb-2 block text-sm font-medium text-gray-200">Mot de passe actuel</label>
              <input
                id="current_password"
                v-model="form.current_password"
                type="password"
                autocomplete="current-password"
                class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
              />
              <div v-if="form.errors.current_password" class="mt-1 text-sm text-red-400">{{ form.errors.current_password }}</div>
            </div>

            <div>
              <label for="password" class="mb-2 block text-sm font-medium text-gray-200">Nouveau mot de passe</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
              />
              <div v-if="form.errors.password" class="mt-1 text-sm text-red-400">{{ form.errors.password }}</div>
            </div>

            <div>
              <label for="password_confirmation" class="mb-2 block text-sm font-medium text-gray-200">Confirmer le mot de passe</label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-light-blue focus:outline-none focus:ring-2 focus:ring-light-blue/50"
              />
            </div>

            <div class="pt-2 flex gap-3">
              <Button type="submit" :disabled="form.processing" class="bg-gradient-to-r from-light-blue to-cyan-500 px-6 py-3 font-semibold text-[#2c3e50] hover:from-cyan-300 hover:to-light-blue hover:shadow-lg hover:shadow-light-blue/30">
                {{ form.processing ? 'Enregistrement...' : 'Mettre à jour le mot de passe' }}
              </Button>
              <Button type="button" variant="outline" class="border-gray-600 text-gray-200 hover:bg-gray-700" @click="logout">
                Se déconnecter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
