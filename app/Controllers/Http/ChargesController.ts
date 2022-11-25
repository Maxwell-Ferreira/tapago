import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpException from 'App/Exceptions/HttpException'
import Charge from 'App/Models/Charge'
import User from 'App/Models/User'
import QueryFilter from 'App/Utils/QueryFilter'
import CreateChargeValidator from 'App/Validators/CreateChargeValidator'
import UpdateChargeValidator from 'App/Validators/UpdateChargeValidator'

export default class ChargesController {
  private getCharge(user?: User, id?: number) {
    return user?.related('charges').query().where({ id }).firstOrFail()
  }

  public async index({ auth }: HttpContextContract) {
    const query = auth.user?.related('charges').query()
    return new QueryFilter(query, {}).execute(true, true)
  }

  public async store({ auth, request }: HttpContextContract) {
    const validation = await request.validate(CreateChargeValidator)
    const payload = { ...validation, user_id: auth.user?.id }

    return Charge.create(payload)
  }

  public async show({ auth, params }: HttpContextContract) {
    return this.getCharge(auth.user, params.id)
  }

  public async update({ auth, request, params }: HttpContextContract) {
    const charge = await this.getCharge(auth.user, params.id)
    const payload = await request.validate(UpdateChargeValidator)

    charge?.merge(payload)
    await charge?.save()

    return charge
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const charge = await this.getCharge(auth.user, params.id)

    const hasDependencies = await charge?.related('payments').query().firstOrFail()

    if (hasDependencies) {
      throw new HttpException('Esta cobrança possui registros dependentes e não pode ser apagada.')
    }

    await charge?.delete()

    return {
      message: 'Cobrança excluída!',
    }
  }
}
