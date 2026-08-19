<script lang="ts" setup>
import { loginSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'

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
    serverError.value = (e as Error).message
  }
})
</script>

<template>
  <div>Login View</div>

  <form @submit="onSubmit">
    <h1>Sign in</h1>

    <input v-model="email" v-bind="emailAttrs" type="email" placeholder="Email" />
    <p v-if="errors.email">{{ errors.email }}</p>

    <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="Password" />
    <p v-if="errors.password">{{ errors.password }}</p>

    <p v-if="serverError">{{ serverError }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sign in...' : 'Sign in' }}
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
