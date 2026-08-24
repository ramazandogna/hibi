<script setup lang="ts">
const { title } = defineProps<{ title: string }>()
</script>

<template>
  <header class="grid grid-cols-[2.5rem_1fr_2.5rem] items-center">
    <div class="justify-self-start"><slot name="left" /></div>

    <h1 class="text-ink truncate text-center text-base font-semibold tabular-nums">
      {{ title }}
    </h1>

    <div class="justify-self-end"><slot name="right" /></div>
  </header>
</template>
