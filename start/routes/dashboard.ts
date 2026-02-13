import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DashboardController = () => import('#controllers/dashboard_controller')

router
  .group(() => {
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')
    router.get('/dashboard/test-realtime', async () => {
      const BroadcastService = (await import('#services/broadcast_service')).default
      await BroadcastService.refreshDashboard()
      return 'Sinal de atualização enviado com sucesso!'
    })
  })
  .middleware([middleware.auth()])
