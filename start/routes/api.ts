import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // Health Check
    router.get('/health', async ({ response }) => {
      const { DateTime } = await import('luxon')
      return response.ok({
        status: 'ok',
        timestamp: DateTime.now().toISO(),
        service: 'Zabe Analytic API',
      })
    })
  })
  .prefix('api/v1')
