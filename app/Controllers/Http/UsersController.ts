import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async register({ request }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    return User.create(payload)
  }

  public async login({ auth, request }: HttpContextContract) {
    const paylaod = await request.validate(LoginUserValidator)

    return auth.attempt(paylaod.email, paylaod.password)
  }

  public async logout({ auth }: HttpContextContract) {
    return auth.logout()
  }

  public async me({ auth }: HttpContextContract) {
    return auth.user
  }

  public async updateMe({ auth, request }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)

    auth.user?.merge(payload)
    await auth.user?.save()

    return auth.user
  }
}
