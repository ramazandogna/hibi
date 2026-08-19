<script lang="ts" setup>
import { toAuthMessage } from '@/features/auth/auth.errors'
import { signupSchema } from '@/features/auth/auth.schema'
import { useAuthStore } from '@/features/auth/auth.store'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

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
      await router.push('/')
    }
  } catch (e) {
    serverError.value = toAuthMessage(e)
  }
})
</script>

<template>
  <div>SignUp View</div>

  <p v-if="awaitingConfirmation">Check your inbox - we sent a confirmation link to {{ email }}!</p>

  <form @submit="onSubmit">
    <h1>Create Account</h1>

    <input v-model="email" v-bind="emailAttrs" type="email" placeholder="Email" />
    <p v-if="errors.email">{{ errors.email }}</p>

    <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="Password" />
    <p v-if="errors.password">{{ errors.password }}</p>

    <input
      v-model="confirmPassword"
      v-bind="confirmPasswordAttrs"
      type="password"
      placeholder="Confirm password"
    />
    <p v-if="errors.confirmPassword">{{ errors.confirmPassword }}</p>

    <p v-if="serverError">{{ serverError }}</p>

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
</template>

<style>
.auth-link {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
</style>
