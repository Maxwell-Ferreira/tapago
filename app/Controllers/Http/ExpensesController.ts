import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Expense, { ExpenseType } from 'App/Models/Expense'
import User from 'App/Models/User'
import QueryFilter from 'App/Utils/QueryFilter'
import CreateExpenseValidator from 'App/Validators/CreateExpenseValidator'
import UpdateExpenseValidator from 'App/Validators/UpdateExpenseValidator'
import { format, lastDayOfMonth } from 'date-fns'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import { getMonthName } from 'App/Utils/DateHelper/getMonthName'

export default class ExpensesController {
  private getExpense(user?: User, id?: number) {
    return user?.related('expenses').query().where({ id }).firstOrFail()
  }

  private getExpenses(type: string, user?: User) {
    const query = user?.related('expenses').query().where('type', type)
    return new QueryFilter(query, {}).execute(true, true)
  }

  public async findAllFixeds({ auth }: HttpContextContract) {
    return this.getExpenses('FIXED', auth.user)
  }

  public async findAllSingle({ auth }: HttpContextContract) {
    return this.getExpenses('SINGLE', auth.user)
  }

  public async statistics(qs: any, user?: User) {
    const competenceValidatinSchema = schema.create({
      competence: schema.date.optional({ format: 'yyyy-MM' }),
    })

    const competenceValidation = await validator
      .validate({ schema: competenceValidatinSchema, data: qs })
      .catch(() => ({ competence: undefined }))

    const now = new Date()

    let competence: string
    if (!competenceValidation.competence) {
      competence = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
    } else {
      competence = format(competenceValidation.competence.toJSDate(), 'yyyy-MM')
    }

    const parts = competence.split('-')
    const year = parts[0]
    const month = parts[1]

    const minDate = new Date(`${year}-${month}-01 00:00:00`)
    const maxDate = lastDayOfMonth(minDate)

    const totalSingle = await Database.from('expenses')
      .sum('amount as total')
      .where({ user_id: user?.id, type: 'SINGLE' })
      .where('created_at', '>=', format(minDate, 'yyyy-MM-dd'))
      .where('created_at', '<=', format(maxDate, 'yyyy-MM-dd'))
      .then((resp) => Number(resp[0]?.total) || 0)

    const totalFixedsQuery = Database.from('expenses')
      .sum('amount as total')
      .where({ user_id: user?.id, type: 'FIXED' })

    if (Number(year) <= now.getFullYear() && Number(month) <= now.getMonth() + 1) {
      totalFixedsQuery
        .where('created_at', '>=', format(minDate, 'yyyy-MM-dd'))
        .where('created_at', '<=', format(maxDate, 'yyyy-MM-dd'))
    } else {
      totalFixedsQuery.where((query) => {
        query.whereNull('expires_in')
        query.orWhere('expires_in', '>=', format(minDate, 'yyyy-MM-dd'))
      })
    }

    const totalFixeds = await totalFixedsQuery.exec().then((resp) => Number(resp[0]?.total) || 0)

    const monthlyLimit = Number(user?.monthlyLimit || 0)

    const totalExpenses = totalFixeds + totalSingle
    const status = totalExpenses > monthlyLimit ? 'BAD' : 'GOOD'

    return {
      year,
      month,
      monthName: getMonthName(month),
      totalExpenses,
      totalFixeds,
      totalSingle,
      monthlyLimit,
      status,
    }
  }

  public async listSingle({ auth }) {
    return this.getExpenses('SINGLE', auth.user)
  }

  public async listFixeds({ auth }: HttpContextContract) {
    return this.getExpenses('FIXED', auth.user)
  }

  public async store({ request, auth }: HttpContextContract) {
    const validation = await request.validate(CreateExpenseValidator)
    const type = ExpenseType[validation.type as ExpenseType]

    const payload = { ...validation, type, userId: auth.user?.id }

    return Expense.create(payload)
  }

  public async show({ auth, params }: HttpContextContract) {
    return this.getExpense(auth.user, params.id)
  }

  public async update({ auth, request, params }: HttpContextContract) {
    const expense = await this.getExpense(auth.user, params.id)
    const payload = await request.validate(UpdateExpenseValidator)

    const type = payload.type as ExpenseType

    expense?.merge({ ...payload, type })
    await expense?.save()

    return this.getExpense(auth.user, expense?.id)
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const expense = await this.getExpense(auth.user, params.id)
    await expense?.delete()

    return {
      message: 'Despesa deletada com sucesso',
    }
  }
}
