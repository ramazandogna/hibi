<script lang="ts" setup>
import { toAuthMessage } from '@/features/auth/auth.errors'
import { signupSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { safeRedirect } from '@/shared/lib/redirect'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  } catch (e) {
    serverError.value = toAuthMessage(e)
  }
})
</script>

<template>
  <div class="auth-page">
    <div>SignUp View</div>

    <p v-if="awaitingConfirmation" role="status">
      Check your inbox - we sent a confirmation link to {{ email }}!
    </p>

    <form v-else novalidate @submit="onSubmit">
      <h1>Create Account</h1>

      <label for="signup-email">Email</label>
      <input
        id="signup-email"
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        autocomplete="email"
        placeholder="Email"
        :aria-invalid="Boolean(errors.email)"
        :aria-describedby="errors.email ? 'signup-email-error' : undefined"
      />
      <p v-if="errors.email" id="signup-email-error">{{ errors.email }}</p>

      <label for="signup-password">Password</label>
      <input
        id="signup-password"
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        autocomplete="new-password"
        placeholder="Password"
        :aria-invalid="Boolean(errors.password)"
        :aria-describedby="errors.password ? 'signup-password-error' : undefined"
      />
      <p v-if="errors.password" id="signup-password-error">{{ errors.password }}</p>

      <label for="signup-confirm-password">Confirm password</label>
      <input
        id="signup-confirm-password"
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        type="password"
        autocomplete="new-password"
        placeholder="Confirm password"
        :aria-invalid="Boolean(errors.confirmPassword)"
        :aria-describedby="errors.confirmPassword ? 'signup-confirm-password-error' : undefined"
      />
      <p v-if="errors.confirmPassword" id="signup-confirm-password-error">
        {{ errors.confirmPassword }}
      </p>

      <p v-if="serverError" role="alert">{{ serverError }}</p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <div class="auth-link">
      <span>
        <RouterLink to="/"> Anasayfa </RouterLink>
      </span>
      <span>
        <RouterLink to="/login"> Login </RouterLink>
      </span>
    </div>
  </div>
</template>

<style>
.auth-link {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
</style>
