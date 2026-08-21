<script lang="ts" setup>
import { useHabits } from '@/features/habits/habits.queries'

const { data: habits, isPending, error } = useHabits()
</script>
<template>
  <div>
    <p v-if="isPending">Loading...</p>
    <p v-else-if="error">{{ error.message }}</p>
    <ul v-else>
      <li v-for="habit in habits ?? []" :key="habit.id">{{ habit.name }}</li>
    </ul>
  </div>
</template>

<style></style>
