import type { Enums, Tables, TablesInsert, TablesUpdate } from '@/shared/types/database.types'

/** 'build' | 'quit' | 'scale' — kaynağı veritabanındaki habit_kind enum'ı. */
export type HabitKind = Enums<'habit_kind'>

/** Veritabanından okunan bir takip satırı. */
export type Habit = Tables<'habits'>

/** Yeni takip oluştururken gönderilen alanlar. */
export type NewHabit = TablesInsert<'habits'>

/** Var olan bir takibi güncellerken gönderilen kısmi alanlar. */
export type HabitPatch = TablesUpdate<'habits'>
