<script setup lang="ts">
const { size = 'md' } = defineProps<{ size?: 'sm' | 'md' | 'lg' }>()

const SIZE = {
  sm: { hiragana: 'text-[1.6rem]', latin: 'text-[0.6rem]' },
  md: { hiragana: 'text-[2.75rem]', latin: 'text-sm' },
  lg: { hiragana: 'text-6xl', latin: 'text-base' },
} as const
</script>

<template>
  <!-- The column shrinks to the hiragana, so the Latin line below can justify
       its letters across exactly that width. -->
  <span class="inline-flex flex-col items-center gap-1">
    <span
      class="brand-gradient bg-clip-text leading-none font-bold tracking-wide text-transparent"
      :class="SIZE[size].hiragana"
      lang="ja"
      aria-hidden="true"
    >
      ひび
    </span>

    <span
      class="brand-gradient flex w-full justify-between bg-clip-text leading-none font-semibold text-transparent"
      :class="SIZE[size].latin"
      aria-hidden="true"
    >
      <span>h</span><span>İ</span><span>b</span><span>İ</span>
    </span>

    <span class="sr-only">Hibi</span>
  </span>
</template>
