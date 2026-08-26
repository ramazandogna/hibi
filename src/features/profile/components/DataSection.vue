<script setup lang="ts">
import { ref } from 'vue'

import { deleteAllData, exportEverything } from '../profile.api'
import { useAuthStore } from '@/features/auth/auth.store'
import { toAppError } from '@/shared/lib/app-error'
import { downloadJson } from '@/shared/lib/download'
import { todayKey } from '@/shared/lib/date'
import { queryClient } from '@/app/providers/query'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'

const auth = useAuthStore()

const isExporting = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')

const confirmOpen = ref(false)
const typedEmail = ref('')

async function exportData() {
  errorMessage.value = ''
  isExporting.value = true

  try {
    downloadJson(await exportEverything(), `hibi-export-${todayKey()}.json`)
  } catch (error) {
    errorMessage.value = toAppError(error).message
  } finally {
    isExporting.value = false
  }
}

async function deleteData() {
  errorMessage.value = ''
  isDeleting.value = true

  try {
    await deleteAllData()
    queryClient.clear()
    confirmOpen.value = false
    typedEmail.value = ''
  } catch (error) {
    errorMessage.value = toAppError(error).message
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Your data</h2>

    <BaseButton variant="ghost" :loading="isExporting" @click="exportData">
      Export everything as JSON
    </BaseButton>

    <button
      type="button"
      class="text-ink-soft hover:text-alert self-center text-xs underline underline-offset-2 transition-colors"
      @click="confirmOpen = true"
    >
      Delete my data
    </button>

    <p v-if="errorMessage" role="alert" class="text-alert text-sm">{{ errorMessage }}</p>

    <BaseSheet v-model="confirmOpen" title="Delete your data">
      <div class="flex flex-col gap-4">
        <p class="text-ink text-sm">
          This removes every habit, entry and note. Your account stays, so you can start over. It
          cannot be undone.
        </p>

        <BaseInput
          v-model="typedEmail"
          label="Type your email to confirm"
          :placeholder="auth.user?.email ?? ''"
          autocomplete="off"
        />

        <BaseButton
          variant="danger"
          :disabled="typedEmail.trim() !== auth.user?.email"
          :loading="isDeleting"
          @click="deleteData"
        >
          Delete permanently
        </BaseButton>
        <BaseButton variant="ghost" @click="confirmOpen = false">Cancel</BaseButton>
      </div>
    </BaseSheet>
  </section>
</template>
