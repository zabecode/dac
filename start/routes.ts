/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

transmit.registerRoutes()

// 1. Redirecionamento Inicial
router.get('/', ({ response }) => response.redirect().toPath('/dashboard'))

/**
 * Módulos de Rotas Separados
 */
import './routes/auth.js'
import './routes/dashboard.js'
import './routes/api_keys.js'
import './routes/admin.js'
import './routes/docs.js'
import './routes/docs_api.js'
import './routes/dac_api.js'
import './routes/dac.js'
import './routes/api.js'
