import vine from '@vinejs/vine'

export const createDeviceSchema = vine.compile(
  vine.object({
    mac: vine.string().maxLength(17),
    lastIp: vine.string().maxLength(45).optional(),
    active: vine.boolean().optional(),
    description: vine.string().maxLength(255).optional(),
    metadata: vine.any().optional(),
  })
)

export const updateDeviceSchema = vine.compile(
  vine.object({
    mac: vine.string().maxLength(17).optional(),
    lastIp: vine.string().maxLength(45).optional(),
    active: vine.boolean().optional(),
    description: vine.string().maxLength(255).nullable().optional(),
    metadata: vine.any().optional(),
  })
)
