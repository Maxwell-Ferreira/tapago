import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateExpenseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number.optional(),
    type: schema.enum.optional(['FIXED', 'SINGLE']),
    expiresIn: schema.date.optional({ format: 'yyyy-MM-dd' }, [rules.afterOrEqual('today')]),
  })

  public messages: CustomMessages = {}
}
