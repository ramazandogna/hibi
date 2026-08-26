<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

import DataSection from '@/features/profile/components/DataSection.vue'
import ProfileSettings from '@/features/profile/components/ProfileSettings.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'

const router = useRouter()
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <PageHeader :title="$t('settings.title')">
      <template #left>
        <button
          type="button"
          class="text-ink-soft hover:text-ink hover:bg-mist flex size-10 items-center justify-center rounded-full transition-colors active:scale-90"
          :aria-label="$t('common.back')"
          @click="router.back()"
        >
          <ArrowLeft class="size-5" />
        </button>
      </template>
    </PageHeader>

    <ProfileSettings />

    <DataSection />
  </div>
</template>
