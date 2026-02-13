import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import { GlobalService } from '#services/global_service'
import ForgotPasswordNotification from '#mails/forgot_password_notification'

export default class AuthController {
  /**
   * Render Login Page
   */
  async loginPage({ inertia, response }: HttpContext) {
    const hasAdmin = await User.query().where('isSuperUser', true).where('isEnabled', true).first()

    if (!hasAdmin) {
      return response.redirect().toPath('/setup')
    }

    return inertia.render('auth/login')
  }

  /**
   * Handle Login Action
   */
  async login({ request, response, auth, session }: HttpContext) {
    const { email, password, remember } = request.only(['email', 'password', 'remember'])

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.isEnabled) {
        session.flash('errors', {
          login: 'A conta está desativada.',
        })
        return response.redirect().back()
      }

      await auth.use('web').login(user, !!remember)
      return response.redirect().toPath('/dashboard')
    } catch (error) {
      session.flash('errors', {
        login: 'Credenciais inválidas',
      })
      return response.redirect().back()
    }
  }

  /**
   * Handle Logout Action
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toPath('/login')
  }

  /**
   * Render Register Page
   */
  async registerPage({ inertia, request }: HttpContext) {
    return inertia.render('auth/register', {
      invite_token: request.input('invite_token'),
      email: request.input('email'),
    })
  }

  /**
   * Handle User Registration
   */
  async register({ request, response, auth, session }: HttpContext) {
    const payload = request.only(['name', 'email', 'password', 'invite_token'])

    if (!payload.email || !payload.password || !payload.name) {
      session.flash('errors', { error: 'Todos os campos são obrigatórios' })
      return response.redirect().back()
    }

    const existingUser = await User.query().where('email', payload.email).first()
    if (existingUser) {
      session.flash('errors', { email: 'Este email já está cadastrado' })
      return response.redirect().back()
    }

    const user = await User.create({
      code: GlobalService.generationCode(),
      kind: 'user',
      name: payload.name,
      email: payload.email,
      password: payload.password,
      isEnabled: true,
      isSuperUser: false,
      acceptTerms: true,
      acceptTermsAt: null,
    })

    await auth.use('web').login(user)
    return response.redirect().toPath('/dashboard')
  }

  /**
   * Render Setup Page (First User)
   */
  async setupPage({ inertia, response }: HttpContext) {
    const hasAdmin = await User.query().where('isSuperUser', true).where('isEnabled', true).first()
    if (hasAdmin) {
      return response.redirect().toPath('/login')
    }

    return inertia.render('auth/setup')
  }

  /**
   * Handle First User Setup
   */
  async handleSetup({ request, response, auth, session }: HttpContext) {
    const hasAdmin = await User.query().where('isSuperUser', true).where('isEnabled', true).first()
    if (hasAdmin) {
      return response.redirect().toPath('/login')
    }

    const payload = request.only(['name', 'email', 'password'])

    if (!payload.email || !payload.password || !payload.name) {
      session.flash('errors', { error: 'Todos os campos são obrigatórios' })
      return response.redirect().back()
    }

    const existingUser = await User.query().where('email', payload.email).first()
    if (existingUser) {
      session.flash('errors', { email: 'Este email já está cadastrado' })
      return response.redirect().back()
    }

    const user = await User.create({
      code: GlobalService.generationCode(),
      kind: 'user',
      name: payload.name,
      email: payload.email,
      password: payload.password,
      isEnabled: true,
      isSuperUser: true,
      acceptTerms: true,
    })

    await auth.use('web').login(user)
    return response.redirect().toPath('/dashboard')
  }

  /**
   * Render Forgot Password Page
   */
  async forgotPasswordPage({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password')
  }

  /**
   * Handle Forgot Password Request
   */
  async forgotPassword({ request, response, session }: HttpContext) {
    const { email } = request.only(['email'])

    if (!email) {
      session.flash('errors', { email: 'O e-mail é obrigatório.' })
      return response.redirect().back()
    }

    const user = await User.findBy('email', email)

    if (user) {
      // Generate Signed URL valid for 30 mins
      const url = router.makeSignedUrl('auth.reset_password', { email }, { expiresIn: '30m' })
      await mail.send(new ForgotPasswordNotification(email, url))
    }

    session.flash('success', 'Se o e-mail existir, você receberá um link de recuperação.')
    return response.redirect().back()
  }

  /**
   * Render Reset Password Page
   */
  async resetPasswordPage({ request, response, inertia, session }: HttpContext) {
    if (!request.hasValidSignature()) {
      session.flash('errors', { error: 'Link de recuperação inválido ou expirado.' })
      return response.redirect().toPath('/login')
    }

    return inertia.render('auth/reset_password', {
      email: request.input('email'),
      signature: request.input('signature'),
    })
  }

  /**
   * Handle Reset Password Action
   */
  async handleResetPassword({ request, response, session }: HttpContext) {
    // Verify signature to ensure the request is authorized
    if (!request.hasValidSignature()) {
      session.flash('errors', { error: 'Link de recuperação inválido ou expirado.' })
      return response.redirect().back()
    }

    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user) {
      session.flash('errors', { error: 'Usuário não encontrado.' })
      return response.redirect().back()
    }

    user.password = password
    await user.save()

    session.flash('success', 'Senha alterada com sucesso. Faça login com a nova senha.')
    return response.redirect().toPath('/login')
  }
}
