import type { Tables, TablesInsert } from '@/shared/types/database.types'

/** An entry row as read from the database. */
export type Entry = Tables<'entries'>

/** Fields accepted when writing an entry; database defaults stay optional. */
export type NewEntry = TablesInsert<'entries'>
