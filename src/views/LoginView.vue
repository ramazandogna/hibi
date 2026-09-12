<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { safeRedirect } from 'rei-kit'
import { toAuthMessageKey } from 'rei-kit/supabase'
import { AuthForm, fieldErrors } from 'rei-kit/app'
import type { AuthFormValues } from 'rei-kit/app'

import { loginSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const serverError = ref('')
const busy = ref(false)
const rememberMe = ref(true)

const validate = (values: AuthFormValues) => fieldErrors(loginSchema(), values)

async function onSubmit(values: AuthFormValues) {
  serverError.value = ''
  busy.value = true

  try {
    await auth.signIn(values.email, values.password, rememberMe.value)
    await router.push(safeRedirect(route.query.redirect))
  } catch (error) {
    serverError.value = toAuthMessageKey(error)
  } finally {
    busy.value = false
  }
}

async function signInWithGoogle() {
  serverError.value = ''
  busy.value = true

  try {
    await auth.signInWithGoogle(rememberMe.value)
  } catch (error) {
    serverError.value = toAuthMessageKey(error)
    busy.value = false
  }
  // No `finally`: on success the browser is already leaving for Google.
}
</script>

<template>
  <AuthForm
    v-model:remember="rememberMe"
    mode="signIn"
    :busy="busy"
    :error="serverError ? $t(serverError) : ''"
    :validate="validate"
    :labels="{
      email: $t('auth.email'),
      password: $t('auth.password'),
      confirmPassword: $t('auth.confirmPassword'),
      submit: $t('auth.signIn'),
      submitBusy: $t('auth.signingIn'),
      google: $t('auth.google'),
      or: $t('auth.or'),
      rememberMe: $t('auth.rememberMe'),
      emailPlaceholder: $t('auth.emailPlaceholder'),
    }"
    @submit="onSubmit"
    @google="signInWithGoogle"
  >
    <template #header>
      <header class="flex flex-col gap-1 text-center">
        <h2 class="text-ink text-lg font-semibold">{{ $t('auth.welcomeBack') }}</h2>
        <p class="text-ink-soft text-sm">{{ $t('auth.pickUp') }}</p>
      </header>
    </template>

    <template #foot>
      <p class="text-ink-soft text-center text-sm">
        {{ $t('auth.noAccount') }}
        <RouterLink to="/signup" class="text-sea font-medium">{{
          $t('auth.createOne')
        }}</RouterLink>
      </p>
    </template>
  </AuthForm>
</template>
