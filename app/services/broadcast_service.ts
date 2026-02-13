import transmit from '@adonisjs/transmit/services/main'

export default class BroadcastService {
  /**
   * Broadcast a refresh signal to the dashboard
   */
  static async refreshDashboard(userId?: number) {
    console.log(`[REALTIME] Broadcast refresh for ${userId || 'admin'}`)
    if (userId) {
      // Broadcast specifically to a user's channel
      transmit.broadcast(`users/${userId}/dashboard`, { refresh: true })
    } else {
      // Broadcast to all (global admin dashboard)
      transmit.broadcast('admin/dashboard', { refresh: true })
    }
  }
}
