import type { Tables, TablesInsert } from '@/shared/types/database.types'

/** A free-text note attached to one calendar day. */
export type DayNote = Tables<'day_notes'>

/** Fields accepted when writing a note; database defaults stay optional. */
export type NewDayNote = TablesInsert<'day_notes'>
