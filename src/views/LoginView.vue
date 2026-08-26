<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import GoogleButton from '@/features/auth/components/GoogleButton.vue'
import { toAuthMessage } from '@/features/auth/auth.errors'
import { loginSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { safeRedirect } from '@/shared/lib/redirect'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const serverError = ref('')
const rememberMe = ref(true)

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField('email', { validateOnModelUpdate: false })
const [password, passwordAttrs] = defineField('password', { validateOnModelUpdate: false })

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''

  try {
    await auth.signIn(values.email, values.password, rememberMe.value)
    await router.push(safeRedirect(route.query.redirect))
  } catch (error) {
    serverError.value = toAuthMessage(error)
  }
})

async function signInWithGoogle() {
  serverError.value = ''

  try {
    await auth.signInWithGoogle(rememberMe.value)
  } catch (error) {
    serverError.value = toAuthMessage(error)
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <header class="flex flex-col gap-1 text-center">
      <h2 class="text-ink text-lg font-semibold">Welcome back</h2>
      <p class="text-ink-soft text-sm">Pick up where you left off.</p>
    </header>

    <GoogleButton label="Continue with Google" @click="signInWithGoogle" />

    <div class="flex items-center gap-3">
      <span class="bg-hair h-px flex-1" />
      <span class="text-ink-soft text-xs">or</span>
      <span class="bg-hair h-px flex-1" />
    </div>

    <form novalidate class="flex flex-col gap-4" @submit="onSubmit">
      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :error="errors.email"
      />

      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        label="Password"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />

      <label class="text-ink-soft flex items-center gap-2 text-sm">
        <input v-model="rememberMe" type="checkbox" class="accent-sea size-4" />
        Keep me signed in on this device
      </label>

      <p v-if="serverError" role="alert" class="text-alert text-sm">{{ serverError }}</p>

      <BaseButton type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
      </BaseButton>
    </form>

    <p class="text-ink-soft text-center text-sm">
      No account yet?
      <RouterLink to="/signup" class="text-sea font-medium">Create one</RouterLink>
    </p>
  </div>
</template>
