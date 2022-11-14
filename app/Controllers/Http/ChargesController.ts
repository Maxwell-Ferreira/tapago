import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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

  public async create({ view }: HttpContextContract) {
    return view.render('pages/private/expenses/create')
  }

  public async store({ auth, request, session, response }: HttpContextContract) {
    const validation = await request.validate(CreateChargeValidator)
    const payload = {
      ...validation,
      user_id: auth.user?.id,
    }

    return Charge.create(payload).then(() => {
      session.flash('message', 'Cobrança Cadastrada!')
      const continueRegistring = request.input('continueRegistring')
      const next = continueRegistring ? '/charges/create' : '/charges'
      return response.redirect(next)
    })
  }

  public async show({ auth, params }: HttpContextContract) {
    return this.getCharge(auth.user, params.id)
  }

  public async edit({ view }: HttpContextContract) {
    return view.render('pages/private/expenses/form', { formType: 'update' })
  }

  public async update({ auth, request, session, response, params }: HttpContextContract) {
    const charge = await this.getCharge(auth.user, params.id)
    const payload = await request.validate(UpdateChargeValidator)

    charge?.merge(payload)
    await charge?.save()

    session.flash('message', 'Cobrança atualizada!')
    return response.redirect('pages/private/expenses')
  }

  public async destroy({ auth, params, session, response }: HttpContextContract) {
    const charge = await this.getCharge(auth.user, params.id)

    const hasDependencies = await charge?.related('payments').query().firstOrFail()

    if (!hasDependencies) {
      await charge?.delete()
      session.flash('message', 'Cobrança excluída!')
    } else {
      session.flash(
        'message',
        'Esta cobrança possui dependencias (pagamentos) e não pode ser deletada.'
      )
    }

    return response.redirect('pages/private/expenses')
  }
}
