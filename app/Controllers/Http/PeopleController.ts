import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Person from 'App/Models/Person'
import User from 'App/Models/User'
import QueryFilter from 'App/Utils/QueryFilter'
import CreatePersonValidator from 'App/Validators/CreatePersonValidator'
import UpdatePersonValidator from 'App/Validators/UpdatePersonValidator'

export default class PeopleController {
  private getPerson(user?: User, id?: number) {
    return user?.related('people').query().where({ id }).firstOrFail()
  }

  public async index({ auth }: HttpContextContract) {
    const query = auth.user?.related('people').query()

    return new QueryFilter(query, {
      joins: ['user'],
      filterFields: ['id', 'name', 'user.name'],
      searchFields: ['id', 'name', 'user.name'],
    }).execute()
  }

  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate(CreatePersonValidator)
    return Person.create({ ...payload, userId: auth.user?.id })
  }

  public async show({ params, auth }: HttpContextContract) {
    return this.getPerson(auth.user, params.id)
  }

  public async update({ request, params, auth }: HttpContextContract) {
    const person = await this.getPerson(auth.user, params.id)
    const payload = await request.validate(UpdatePersonValidator)

    person?.merge(payload)
    await person?.save()

    return person
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const person = await this.getPerson(auth.user, params.id)
    await person?.delete()

    return { message: 'deleted' }
  }
}
