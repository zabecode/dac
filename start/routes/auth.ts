import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.group(() => {
  router.get('/login', [AuthController, 'loginPage']).as('auth.login')
  router.post('/login', [AuthController, 'login']).as('auth.login.action')
  router.get('/register', [AuthController, 'registerPage']).as('auth.register')
  router.post('/register', [AuthController, 'register']).as('auth.register.action')
  router.post('/logout', [AuthController, 'logout']).as('auth.logout')
  router.get('/setup', [AuthController, 'setupPage']).as('auth.setup')
  router.post('/setup', [AuthController, 'handleSetup']).as('auth.setup.action')
  router.get('/forgot-password', [AuthController, 'forgotPasswordPage']).as('auth.forgot_password')
  router
    .post('/forgot-password', [AuthController, 'forgotPassword'])
    .as('auth.forgot_password.action')

  router.get('/reset-password', [AuthController, 'resetPasswordPage']).as('auth.reset_password')
  router
    .post('/reset-password', [AuthController, 'handleResetPassword'])
    .as('auth.reset_password.action')
})
