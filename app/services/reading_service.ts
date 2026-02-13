import Reading from '#models/reading'
import { createReadingSchema, updateReadingSchema, ReadingEntry } from '#validators/reading'

export class ReadingService {
  /**
   * List readings for an identifier
   */
  static async list(
    identifier: string,
    options?: {
      sensorId?: number
      limit?: number
      orderBy?: string
      orderDirection?: 'asc' | 'desc'
    }
  ) {
    const query = Reading.query().where('identifier', identifier).preload('sensor')

    if (options?.sensorId) {
      query.where('sensorId', options.sensorId)
    }

    query.orderBy(options?.orderBy || 'datetime', options?.orderDirection || 'desc')
    query.limit(options?.limit || 50)

    return await query
  }

  /**
   * Get a single reading by id, scoped by identifier
   */
  static async get(id: number, identifier: string) {
    const reading = await Reading.query()
      .where('id', id)
      .where('identifier', identifier)
      .preload('sensor')
      .firstOrFail()
    return reading
  }

  /**
   * Create a reading manually
   */
  static async create(identifier: string, payload: any) {
    const data = await createReadingSchema.validate(payload)
    const reading = await Reading.create({
      ...data,
      identifier,
      entry: ReadingEntry.MANUAL,
    })
    return reading
  }

  /**
   * Update a reading
   */
  static async update(id: number, identifier: string, payload: any) {
    const data = await updateReadingSchema.validate(payload)
    const reading = await Reading.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    reading.entry = ReadingEntry.EDIT
    await reading.merge(data).save()
    return reading
  }

  /**
   * Delete a reading
   */
  static async delete(id: number, identifier: string) {
    const reading = await Reading.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    await reading.delete()
  }

  /**
   * Batch publish readings from gateway
   */
  static async batchPublish(identifier: string, readings: any[]) {
    const results = { created: 0, updated: 0, errors: 0 }

    for (const item of readings) {
      try {
        // Check if reading with uniqueId already exists
        if (item.uniqueId) {
          const existing = await Reading.query()
            .where('uniqueId', item.uniqueId)
            .where('identifier', identifier)
            .first()

          if (existing) {
            existing.merge({
              value: item.value,
              grouping: item.grouping,
              opened: item.opened,
              openedAt: item.openedAt,
              closedAt: item.closedAt,
            })
            await existing.save()
            results.updated++
            continue
          }
        }

        // Create new reading
        await Reading.create({
          uniqueId: item.uniqueId,
          sensorId: item.sensorId,
          identifier,
          datetime: item.datetime,
          grouping: item.grouping || null,
          opened: item.opened || false,
          entry: ReadingEntry.AUTOMATIC,
          kind: item.kind || 'unique',
          openedAt: item.openedAt || null,
          closedAt: item.closedAt || null,
          value: item.value,
        })
        results.created++
      } catch {
        results.errors++
      }
    }

    return results
  }
}
