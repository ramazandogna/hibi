<script lang="ts" setup>
import { loginSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { toAuthMessage } from '@/features/auth/auth.errors'

const auth = useAuthStore()
const router = useRouter()

const serverError = ref('')

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField('email', { validateOnModelUpdate: false })
const [password, passwordAttrs] = defineField('password', { validateOnModelUpdate: false })

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await auth.signIn(values.email, values.password)
    await router.push('/')
  } catch (e) {
    serverError.value = toAuthMessage(e)
  }
})
</script>

<template>
  <div>Login View</div>

  <form novalidate @submit="onSubmit">
    <h1>Sign in</h1>

    <label for="login-email">Email</label>
    <input
      id="login-email"
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      autocomplete="email"
      placeholder="Email"
      :aria-invalid="Boolean(errors.email)"
      :aria-describedby="errors.email ? 'login-email-error' : undefined"
    />
    <p v-if="errors.email" id="login-email-error">{{ errors.email }}</p>

    <label for="login-password">Password</label>
    <input
      id="login-password"
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      autocomplete="current-password"
      placeholder="Password"
      :aria-invalid="Boolean(errors.password)"
      :aria-describedby="errors.password ? 'login-password-error' : undefined"
    />
    <p v-if="errors.password" id="login-password-error">{{ errors.password }}</p>

    <p v-if="serverError" role="alert">{{ serverError }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
    </button>
  </form>

  <div class="auth-link">
    <span>
      <RouterLink to="/"> Anasayfa </RouterLink>
    </span>
    <span>
      <RouterLink to="/signup"> Signup </RouterLink>
    </span>
  </div>
</template>

<style>
.auth-link {
  margin-top: auto;
}
</style>
