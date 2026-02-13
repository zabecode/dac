import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'
import { GlobalService } from '#services/global_service'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  // List users (Admin only)
  async index({ inertia, auth, response, request }: HttpContext) {
    const user = auth.user! as User

    // Check if super user
    if (!user.isSuperUser) {
      return response.redirect('/')
    }

    const query = User.query()
      .where('id', '!=', user.id) // Exclude self
      .where('kind', 'user')
      .orderBy('createdAt', 'desc')

    // Filtering
    const search = request.input('search')
    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`).orWhere('email', 'ilike', `%${search}%`)
      })
    }

    const role = request.input('role')
    if (role === 'superuser') {
      query.where('is_super_user', true)
    } else if (role === 'standard') {
      query.where('is_super_user', false)
    }

    const status = request.input('status')
    if (status === 'active') {
      query.where('is_enabled', true)
    } else if (status === 'inactive') {
      query.where('is_enabled', false)
    }

    const users = await query

    return inertia.render('users/index', { users, filters: request.qs() })
  }

  // Create user (Admin only)
  async store({ request, auth, response }: HttpContext) {
    const admin = auth.user! as User
    if (!admin.isSuperUser) {
      return response.unauthorized('Only super users can create users')
    }

    const schema = vine.object({
      name: vine.string().maxLength(255),
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          const user = await db.from('users').where('email', value).first()
          return !user
        }),
      password: vine.string().minLength(8),
      isSuperUser: vine.boolean().optional(),
      isEnabled: vine.boolean().optional(),
    })

    const payload = await vine.validate({ schema, data: request.all() })

    await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      isSuperUser: payload.isSuperUser ?? false,
      isEnabled: payload.isEnabled ?? true,
      kind: 'user',
      code: GlobalService.generationCode(),
    })

    return response.redirect().back()
  }

  // Update user
  async update({ request, params, auth, response }: HttpContext) {
    const admin = auth.user! as User
    if (!admin.isSuperUser) return response.unauthorized()

    const user = await User.findOrFail(params.id)
    const data = request.only(['isEnabled', 'isSuperUser', 'password', 'name', 'email'])

    if (data.name) user.name = data.name
    if (data.email) user.email = data.email
    if (typeof data.isEnabled === 'boolean') user.isEnabled = data.isEnabled
    if (typeof data.isSuperUser === 'boolean') user.isSuperUser = data.isSuperUser
    if (data.password && data.password.length >= 8) user.password = data.password



    await user.save()
    return response.redirect().back()
  }

  // Delete user
  async destroy({ params, auth, response }: HttpContext) {
    const admin = auth.user! as User
    if (!admin.isSuperUser) return response.unauthorized()

    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.redirect().back()
  }

  // Render profile settings
  async profile({ inertia, auth }: HttpContext) {
    const user = auth.user!

    return inertia.render('settings/profile', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperUser: Boolean(user.isSuperUser),
      },
    })
  }

  // Update personal profile
  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user! as User

    const schema = vine.object({
      name: vine.string().maxLength(255).optional(),
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          const match = await db.from('users').where('email', value).whereNot('id', user.id).first()
          return !match
        })
        .optional(),
      password: vine.string().minLength(8).optional(),
      currentPassword: vine.string().optional(),
    })

    const payload = await vine.validate({ schema, data: request.all() })

    if (payload.name) user.name = payload.name
    if (payload.email) user.email = payload.email

    // Password update logic
    if (payload.password) {
      if (!payload.currentPassword) {
        return response.status(422).send({
          errors: [
            {
              field: 'currentPassword',
              message: 'A senha atual é obrigatória para definir uma nova senha.',
            },
          ],
        })
      }

      const isPasswordValid = await hash.verify(user.password || '', payload.currentPassword)
      if (!isPasswordValid) {
        return response.status(422).send({
          errors: [{ field: 'currentPassword', message: 'A senha atual está incorreta.' }],
        })
      }

      user.password = payload.password
    }

    await user.save()

    return response.redirect().back()
  }
}
