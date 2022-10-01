import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'

export default class UsersController {
  public async registerForm({ view }: HttpContextContract) {
    return view.render('pages/public/register')
  }

  public async register({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    await User.create(payload).then(() => {
      session.flash('message', 'Cadastro realizado! Faça seu login para acessar o dashboard.')
      response.redirect('/auth/login')
    })
  }

  public async loginForm({ view }: HttpContextContract) {
    return view.render('pages/public/login')
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const paylaod = await request.validate(LoginUserValidator)

    await auth.attempt(paylaod.email, paylaod.password).then(() => response.redirect('/'))
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.redirect('/auth/login')
  }
}
