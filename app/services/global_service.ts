export class GlobalService {
  /**
   * Generate a unique numeric code based on timestamp
   */
  static generationCode(): number {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return Number(`${timestamp}${random}`)
  }
}
