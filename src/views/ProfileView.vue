<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/features/auth/auth.store'
import BaseButton from '@/shared/ui/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <div class="flex w-full flex-col gap-4 p-4">
    <h1 class="text-ink text-lg font-semibold">Profile</h1>
    <p class="text-ink-soft text-sm">{{ auth.user?.email ?? 'not signed in' }}</p>

    <BaseButton variant="ghost" @click="logout">Sign out</BaseButton>
  </div>
</template>
