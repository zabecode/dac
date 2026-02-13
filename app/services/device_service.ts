import Device from '#models/device'
import Sensor from '#models/sensor'
import { createDeviceSchema, updateDeviceSchema } from '#validators/device'
import { DateTime } from 'luxon'

export class DeviceService {
  /**
   * List all devices for an identifier
   */
  static async list(identifier: string) {
    const devices = await Device.query()
      .where('identifier', identifier)
      .preload('sensors')
      .orderBy('created_at', 'desc')
    return devices
  }

  /**
   * Get a single device by id, scoped by identifier
   */
  static async get(id: number, identifier: string) {
    const device = await Device.query()
      .where('id', id)
      .where('identifier', identifier)
      .preload('sensors')
      .firstOrFail()
    return device
  }

  /**
   * Create a new device
   */
  static async create(identifier: string, payload: any) {
    const data = await createDeviceSchema.validate(payload)
    const device = await Device.create({
      ...data,
      identifier,
    })
    return device
  }

  /**
   * Update a device
   */
  static async update(id: number, identifier: string, payload: any) {
    const data = await updateDeviceSchema.validate(payload)
    const device = await Device.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    await device.merge(data).save()
    return device
  }

  /**
   * Delete a device
   */
  static async delete(id: number, identifier: string) {
    const device = await Device.query()
      .where('id', id)
      .where('identifier', identifier)
      .firstOrFail()
    await device.delete()
  }

  /**
   * Publish device + sensors from gateway (upsert)
   */
  static async publishDevice(identifier: string, payload: any) {
    const { device: deviceData, sensors: sensorsData } = payload

    // Upsert device by MAC
    let device = await Device.query()
      .where('mac', deviceData.mac)
      .where('identifier', identifier)
      .first()

    if (!device) {
      device = await Device.create({
        identifier,
        mac: deviceData.mac,
        lastIp: deviceData.ip || null,
        metadata: deviceData.metrics ? { metrics: deviceData.metrics } : null,
        active: true,
        lastConnectionAt: DateTime.now(),
      })
    } else {
      device.lastIp = deviceData.ip || device.lastIp
      device.lastConnectionAt = DateTime.now()
      if (deviceData.metrics) {
        device.metadata = { ...device.metadata, metrics: deviceData.metrics }
      }
      await device.save()
    }

    // Upsert sensors
    if (sensorsData && Array.isArray(sensorsData)) {
      for (const sensorData of sensorsData) {
        let sensor = await Sensor.query()
          .where('code', sensorData.code)
          .where('identifier', identifier)
          .where('deviceId', device.id)
          .first()

        if (!sensor) {
          await Sensor.create({
            identifier,
            deviceId: device.id,
            code: sensorData.code,
            name: sensorData.name || `Sensor ${sensorData.code}`,
            description: sensorData.description || null,
            active: true,
            kind: sensorData.kind || 'custom',
            lastConnectionAt: DateTime.now(),
            metadata: {
              metric: sensorData.metric,
              meta: sensorData.meta,
            },
          })
        } else {
          sensor.metadata = {
            ...sensor.metadata,
            metric: sensorData.metric,
            meta: sensorData.meta,
          }
          sensor.lastConnectionAt = DateTime.now()
          await sensor.save()
        }
      }
    }

    return device
  }
}
