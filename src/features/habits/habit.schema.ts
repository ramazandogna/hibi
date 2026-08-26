import { z } from 'zod'

import { Constants } from '@/shared/types/database.types'
import { t } from '@/shared/i18n'

/**
 * Shape of a new habit as the form collects it.
 *
 * Mirrors the database constraints from `0001_init.sql`: client validation is
 * UX, the check constraints are the guarantee. Field names match the columns,
 * so no mapping layer is needed between form and API.
 *
 * Built on call so its messages pick up the language active at that moment.
 */
export function createHabitSchema() {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('validation.nameRequired'))
      .max(40, t('validation.nameMax')),
    kind: z.enum(Constants.public.Enums.habit_kind),
    icon: z.string().min(1).default('circle'),
    target_per_week: z.number().int().min(1).max(7).default(7),
  })
}

export type CreateHabitValues = z.infer<ReturnType<typeof createHabitSchema>>
