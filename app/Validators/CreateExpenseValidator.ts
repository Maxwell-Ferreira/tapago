import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateExpenseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number(),
    description: schema.string(),
    type: schema.enum(['FIXED', 'SINGLE']),
    expiresIn: schema.date.optional({ format: 'yyyy-MM-dd' }, [rules.afterOrEqual('today')]),
  })

  public messages: CustomMessages = {
    'amount.required': 'Favor, preencha o campo Valor.',
    'amount.number': 'O campo valor deve ser um número.',
    'description.required': 'Favor, preencha o campo Descrição.',
    'type.required': 'Favor, selecione um tipo.',
    'type.enum': 'Favor, selecione um tipo válido.',
  }
}
