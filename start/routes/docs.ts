import router from '@adonisjs/core/services/router'

const DocsController = () => import('#controllers/docs_controller')

router.group(() => {
  router.get('/docs', [DocsController, 'index']).as('docs.index')
})
