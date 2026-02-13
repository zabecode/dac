import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sensor from '#models/sensor'

export default class Reading extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uniqueId: number | null

  @column()
  declare identifier: string

  @column()
  declare sensorId: number

  @column()
  declare entry: string

  @column()
  declare kind: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare value: any

  @column({ consume: (value) => Boolean(value) })
  declare opened: boolean

  @column()
  declare grouping: string | null

  @column.dateTime()
  declare datetime: DateTime

  @column.dateTime()
  declare openedAt: DateTime | null

  @column.dateTime()
  declare closedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Sensor)
  declare sensor: BelongsTo<typeof Sensor>
}
