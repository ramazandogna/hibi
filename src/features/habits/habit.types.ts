import type { Tables, TablesInsert, TablesUpdate } from '@/shared/types/database.types'

// Defined in shared/lib/kind.ts so shared UI never has to import from a feature.
export type { HabitKind } from '@/shared/lib/kind'

/** A habit row as read from the database. */
export type Habit = Tables<'habits'>

/** Fields accepted when creating a habit; database defaults stay optional. */
export type NewHabit = TablesInsert<'habits'>

/** Partial fields accepted when updating an existing habit. */
export type HabitPatch = TablesUpdate<'habits'>
