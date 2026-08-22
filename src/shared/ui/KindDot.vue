<script setup lang="ts">
import { computed } from 'vue'
import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

const props = defineProps<{
  kind: HabitKind
  showLabel?: boolean
}>()

const meta = computed(() => KIND_META[props.kind])
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    <span class="size-2 rounded-full" :class="meta.fill" />
    <span v-if="showLabel" class="text-ink-soft text-xs font-medium">{{ meta.label }}</span>
  </span>
</template>
