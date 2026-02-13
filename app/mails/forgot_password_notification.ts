import { BaseMail } from '@adonisjs/mail'

export default class ForgotPasswordNotification extends BaseMail {
  from = 'Zabe Analytic <no-reply@zube.App>'
  subject = 'Recuperação de Senha'

  constructor(
    private email: string,
    private url: string
  ) {
    super()
  }

  prepare() {
    const html = `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${this.url}">${this.url}</a>
      <p>Link válido por 30 minutos.</p>
      <p>Se você não solicitou, ignore este email.</p>
    `

    this.message.to(this.email).html(html)
  }
}
