import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'

export default class UsersController {
  public async register({ request }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    return User.create(payload)
  }

  public async loginForm({ view }: HttpContextContract) {
    return view.render('login')
  }

  public async login({ auth, request }: HttpContextContract) {
    const { email, password } = await request.validate(LoginUserValidator)
    return auth.attempt(email, password, {
      expiresIn: '2 hours',
    })
  }
}
