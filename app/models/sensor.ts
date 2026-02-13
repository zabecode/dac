import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Device from '#models/device'
import Reading from '#models/reading'

export default class Sensor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identifier: string

  @column()
  declare deviceId: number

  @column()
  declare code: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ consume: (value) => Boolean(value) })
  declare active: boolean

  @column()
  declare kind: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare metadata: Record<string, any> | null

  @column.dateTime()
  declare lastConnectionAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Device)
  declare device: BelongsTo<typeof Device>

  @hasMany(() => Reading)
  declare readings: HasMany<typeof Reading>
}
