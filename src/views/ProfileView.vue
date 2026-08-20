<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/auth.store'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <div>Profile View</div>
  <p>{{ auth.user?.email ?? 'not signed in' }}</p>
  <button @click="logout">Sign out</button>
</template>

<style></style>
