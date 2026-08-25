<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

const open = defineModel<boolean>({ required: true })
const { title } = defineProps<{ title: string }>()

const panel = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    setBackgroundInert(true)
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    panel.value?.focus()
  } else {
    window.removeEventListener('keydown', onKeydown)
    lastFocused?.focus()
    lastFocused = null
    setBackgroundInert(false)
  }
})

/**
 * `inert` takes the whole app out of tab order and pointer events while the
 * sheet is open — a real focus trap without keydown bookkeeping.
 *
 * The sheet itself is teleported to `#sheet-root`, a sibling of `#app`, so it
 * stays interactive.
 */
function setBackgroundInert(isInert: boolean) {
  document.getElementById('app')?.toggleAttribute('inert', isInert)
}

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  // Unmounting while open would otherwise leave the whole app inert forever.
  setBackgroundInert(false)
})
</script>

<template>
  <Teleport to="#sheet-root">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="shell-frame md:rounded-shell relative flex flex-col justify-end overflow-hidden"
        >
          <div class="bg-ink/40 absolute inset-0" @click="close" />

          <section
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            tabindex="-1"
            class="bg-surface safe-b relative max-h-[85%] overflow-y-auto rounded-t-3xl p-5 outline-none"
          >
            <header class="mb-4 flex items-center justify-between">
              <h2 class="text-ink text-lg font-semibold">{{ title }}</h2>
              <button type="button" class="text-ink-soft text-sm" @click="close">Close</button>
            </header>

            <slot />
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 150ms ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>
