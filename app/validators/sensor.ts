import vine from '@vinejs/vine'

export enum SensorKind {
  MODBUS = 'modbus',
  MQTT = 'mqtt',
  HTTP = 'http',
  CUSTOM = 'custom',
}

export const createSensorSchema = vine.compile(
  vine.object({
    deviceId: vine.number(),
    code: vine.number().min(1),
    name: vine.string().maxLength(100),
    description: vine.string().maxLength(180).optional(),
    active: vine.boolean().optional(),
    kind: vine.string().maxLength(30).optional(),
    metadata: vine.any().optional(),
  })
)

export const updateSensorSchema = vine.compile(
  vine.object({
    deviceId: vine.number().optional(),
    code: vine.number().min(1).optional(),
    name: vine.string().maxLength(100).optional(),
    description: vine.string().maxLength(180).optional(),
    active: vine.boolean().optional(),
    kind: vine.string().maxLength(30).optional(),
    metadata: vine.any().optional(),
  })
)
