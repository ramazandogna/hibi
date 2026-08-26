<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

import ProfileSettings from '@/features/profile/components/ProfileSettings.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'

const router = useRouter()
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <PageHeader title="Settings">
      <template #left>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2"
          aria-label="Back"
          @click="router.back()"
        >
          <ArrowLeft class="size-5" />
        </button>
      </template>
    </PageHeader>

    <ProfileSettings />
  </div>
</template>
