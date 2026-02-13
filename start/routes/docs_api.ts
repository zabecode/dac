import router from '@adonisjs/core/services/router'

const DocsApiController = () => import('#controllers/docs_api_controller')

/**
 * Public Documentation API
 * No authentication required
 */
router
  .group(() => {
    router.get('/docs', [DocsApiController, 'index']).as('api.docs.index')
    router.get('/docs/:slug', [DocsApiController, 'show']).as('api.docs.show')
    router.get('/docs/:slug/raw', [DocsApiController, 'raw']).as('api.docs.raw')
  })
  .prefix('/api/v1')
