<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import GoogleButton from '@/features/auth/components/GoogleButton.vue'
import { toAuthMessage } from '@/features/auth/auth.errors'
import { signupSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { safeRedirect } from '@/shared/lib/redirect'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const serverError = ref('')
const awaitingConfirmation = ref(false)

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(signupSchema),
})

const [email, emailAttrs] = defineField('email', { validateOnModelUpdate: false })
const [password, passwordAttrs] = defineField('password', { validateOnModelUpdate: false })
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword', {
  validateOnModelUpdate: false,
})

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''

  try {
    const { needsEmailConfirmation } = await auth.signUp(values.email, values.password)

    if (needsEmailConfirmation) {
      awaitingConfirmation.value = true
    } else {
      await router.push(safeRedirect(route.query.redirect))
    }
  } catch (error) {
    serverError.value = toAuthMessage(error)
  }
})

async function signUpWithGoogle() {
  serverError.value = ''

  try {
    await auth.signInWithGoogle()
  } catch (error) {
    serverError.value = toAuthMessage(error)
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <p v-if="awaitingConfirmation" role="status" class="text-ink text-center text-sm">
      Check your inbox — we sent a confirmation link to <strong>{{ email }}</strong
      >.
    </p>

    <template v-else>
      <header class="flex flex-col gap-1 text-center">
        <h2 class="text-ink text-lg font-semibold">Start tracking</h2>
        <p class="text-ink-soft text-sm">Build, quit, and notice how you feel.</p>
      </header>

      <GoogleButton label="Continue with Google" @click="signUpWithGoogle" />

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
          autocomplete="new-password"
          hint="At least 8 characters"
          :error="errors.password"
        />

        <BaseInput
          v-model="confirmPassword"
          v-bind="confirmPasswordAttrs"
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          :error="errors.confirmPassword"
        />

        <p v-if="serverError" role="alert" class="text-alert text-sm">{{ serverError }}</p>

        <BaseButton type="submit" :loading="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
        </BaseButton>
      </form>

      <p class="text-ink-soft text-center text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-sea font-medium">Sign in</RouterLink>
      </p>
    </template>
  </div>
</template>
