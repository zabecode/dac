import Sensor from '#models/sensor'
import { createSensorSchema, updateSensorSchema } from '#validators/sensor'

export class SensorService {
  /**
   * List all sensors for an identifier
   */
  static async list(identifier: string, deviceId?: number) {
    const query = Sensor.query()
      .where('identifier', identifier)
      .preload('device')
      .orderBy('created_at', 'desc')

    if (deviceId) {
      query.where('deviceId', deviceId)
    }

    return await query
  }

  /**
   * Get a single sensor by id, scoped by identifier
   */
  static async get(id: number, identifier: string) {
    const sensor = await Sensor.query()
      .where('id', id)
      .where('identifier', identifier)
      .preload('device')
      .firstOrFail()
    return sensor
  }

  /**
   * Create a new sensor
   */
  static async create(identifier: string, payload: any) {
    const data = await createSensorSchema.validate(payload)
    const sensor = await Sensor.create({
      ...data,
      identifier,
    })
    return sensor
  }

  /**
   * Update a sensor
   */
  static async update(id: number, identifier: string, payload: any) {
    const data = await updateSensorSchema.validate(payload)
    const sensor = await Sensor.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    await sensor.merge(data).save()
    return sensor
  }

  /**
   * Delete a sensor
   */
  static async delete(id: number, identifier: string) {
    const sensor = await Sensor.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    await sensor.delete()
  }
}
