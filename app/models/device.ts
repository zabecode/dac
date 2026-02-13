import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Sensor from '#models/sensor'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identifier: string

  @column()
  declare mac: string

  @column()
  declare lastIp: string | null

  @column({ consume: (value) => Boolean(value) })
  declare active: boolean

  @column()
  declare description: string | null

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

  @hasMany(() => Sensor)
  declare sensors: HasMany<typeof Sensor>
}
