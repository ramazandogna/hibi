import type { Tables, TablesInsert } from '@/shared/types/database.types'

/**
 * The columns a read actually asks for.
 *
 * `user_id` is the same value on every row — RLS already guarantees it — and
 * `created_at` is never displayed. Both are UUIDs or timestamps, which is to
 * say incompressible, so on a year-wide range they were most of the payload:
 * dropping them takes the Today screen's fetch from ~49 KB gzipped to ~7 KB and
 * halves the JSON the main thread parses before the first paint.
 */
export const ENTRY_COLUMNS = 'id,habit_id,entry_date,value,note'

/** An entry row as this app reads it — see `ENTRY_COLUMNS`. */
export type Entry = Pick<Tables<'entries'>, 'id' | 'habit_id' | 'entry_date' | 'value' | 'note'>

/** Fields accepted when writing an entry; database defaults stay optional. */
export type NewEntry = TablesInsert<'entries'>
