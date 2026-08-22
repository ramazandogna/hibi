<script setup lang="ts">
import { ref } from 'vue'
import { Archive, ArrowDown, ArrowUp, Pencil, RotateCcw, Trash2 } from 'lucide-vue-next'

import { countHabitEntries } from '../habits.api'
import {
  useArchiveHabit,
  useArchivedHabits,
  useDeleteHabit,
  useHabits,
  useReorderHabits,
  useUnarchiveHabit,
} from '../habits.queries'
import type { Habit } from '../habit.types'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import KindDot from '@/shared/ui/KindDot.vue'

const emit = defineEmits<{ edit: [habit: Habit] }>()

const { data: habits, isPending } = useHabits()
const { data: archivedHabits } = useArchivedHabits()

const reorder = useReorderHabits()
const archive = useArchiveHabit()
const unarchive = useUnarchiveHabit()
const remove = useDeleteHabit()

/** Moves a habit one slot up or down and persists the whole new order. */
function move(index: number, offset: number) {
  const list = habits.value
  if (!list) return

  const target = index + offset
  if (target < 0 || target >= list.length) return

  const ids = list.map((habit) => habit.id)
  const [moved] = ids.splice(index, 1)
  if (!moved) return

  ids.splice(target, 0, moved)
  reorder.mutate(ids)
}

const confirmOpen = ref(false)
const pendingDelete = ref<Habit | undefined>(undefined)
const entryCount = ref<number | null>(null)

async function askDelete(habit: Habit) {
  pendingDelete.value = habit
  entryCount.value = null
  confirmOpen.value = true
  entryCount.value = await countHabitEntries(habit.id)
}

async function confirmDelete() {
  const habit = pendingDelete.value
  if (!habit) return

  await remove.mutateAsync(habit.id)
  confirmOpen.value = false
  pendingDelete.value = undefined
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="flex flex-col gap-2">
      <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Habits</h2>

      <p v-if="isPending" class="text-ink-soft text-sm">Loading…</p>

      <ul v-else class="flex flex-col gap-1">
        <li
          v-for="(habit, index) in habits ?? []"
          :key="habit.id"
          class="border-hair rounded-card flex items-center gap-2 border p-2"
        >
          <KindDot :kind="habit.kind" />
          <span class="text-ink flex-1 truncate text-sm font-medium">{{ habit.name }}</span>

          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1 disabled:opacity-30"
            :disabled="index === 0"
            :aria-label="`Move ${habit.name} up`"
            @click="move(index, -1)"
          >
            <ArrowUp class="size-4" />
          </button>
          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1 disabled:opacity-30"
            :disabled="index === (habits?.length ?? 0) - 1"
            :aria-label="`Move ${habit.name} down`"
            @click="move(index, 1)"
          >
            <ArrowDown class="size-4" />
          </button>
          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1"
            :aria-label="`Edit ${habit.name}`"
            @click="emit('edit', habit)"
          >
            <Pencil class="size-4" />
          </button>
          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1"
            :aria-label="`Archive ${habit.name}`"
            @click="archive.mutate(habit.id)"
          >
            <Archive class="size-4" />
          </button>
        </li>
      </ul>
    </section>

    <section v-if="(archivedHabits?.length ?? 0) > 0" class="flex flex-col gap-2">
      <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Archive</h2>

      <ul class="flex flex-col gap-1">
        <li
          v-for="habit in archivedHabits ?? []"
          :key="habit.id"
          class="border-hair rounded-card flex items-center gap-2 border border-dashed p-2"
        >
          <KindDot :kind="habit.kind" />
          <span class="text-ink-soft flex-1 truncate text-sm">{{ habit.name }}</span>

          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1"
            :aria-label="`Restore ${habit.name}`"
            @click="unarchive.mutate(habit.id)"
          >
            <RotateCcw class="size-4" />
          </button>
          <button
            type="button"
            class="text-alert p-1"
            :aria-label="`Delete ${habit.name}`"
            @click="askDelete(habit)"
          >
            <Trash2 class="size-4" />
          </button>
        </li>
      </ul>
    </section>

    <BaseSheet v-model="confirmOpen" title="Delete habit">
      <div class="flex flex-col gap-4">
        <p class="text-ink text-sm">
          Delete <strong>{{ pendingDelete?.name }}</strong>
          <template v-if="entryCount === null"> and its history?</template>
          <template v-else-if="entryCount === 0"> ? It has no entries yet.</template>
          <template v-else>
            and its <strong>{{ entryCount }}</strong> {{ entryCount === 1 ? 'entry' : 'entries' }}?
          </template>
        </p>
        <p class="text-ink-soft text-xs">This cannot be undone.</p>

        <BaseButton variant="danger" :loading="remove.isPending.value" @click="confirmDelete">
          Delete permanently
        </BaseButton>
        <BaseButton variant="ghost" @click="confirmOpen = false">Cancel</BaseButton>
      </div>
    </BaseSheet>
  </div>
</template>
