import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export enum ReadingEntry {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  EDIT = 'edit',
}

export enum ReadingKind {
  UNIQUE = 'unique',
  MULTIPLE = 'multiple',
  CUSTOM = 'custom',
}

export const createReadingSchema = vine.compile(
  vine.object({
    uniqueId: vine.number().min(1).optional(),
    sensorId: vine.number(),
    kind: vine.string().maxLength(20).optional(),
    value: vine.any(),
    opened: vine.boolean().optional(),
    grouping: vine.string().maxLength(50).optional(),
    datetime: vine.date().transform((value) => DateTime.fromJSDate(value)),
    openedAt: vine
      .date()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
    closedAt: vine
      .date()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
  })
)

export const updateReadingSchema = vine.compile(
  vine.object({
    value: vine.any().optional(),
    opened: vine.boolean().optional(),
    grouping: vine.string().maxLength(50).optional(),
    openedAt: vine
      .date()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
    closedAt: vine
      .date()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
  })
)
