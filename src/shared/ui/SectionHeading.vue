<script setup lang="ts">
import { computed } from 'vue'

import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'
import KindDot from '@/shared/ui/KindDot.vue'

const {
  kind,
  label,
  count = 0,
} = defineProps<{
  kind: HabitKind
  label: string
  count?: number
}>()

const meta = computed(() => KIND_META[kind])
</script>

<template>
  <h2 class="flex items-center gap-2 self-start rounded-full border px-3 py-1" :class="meta.card">
    <KindDot :kind="kind" />
    <span class="text-xs font-semibold tracking-wide uppercase" :class="meta.text">
      {{ label }}
    </span>
    <span v-if="count > 0" class="text-ink-soft text-xs tabular-nums">{{ count }}</span>
  </h2>
</template>
