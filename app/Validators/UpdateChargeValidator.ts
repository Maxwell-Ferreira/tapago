import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Type } from 'App/Models/Charge'

export default class UpdateChargeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number.optional(),
    description: schema.string.optional(),
    type: schema.enum.optional(Object.values(Type)),
    personId: schema.number.optional([
      rules.exists({
        table: 'people',
        column: 'id',
        where: { user_id: this.ctx.auth.user?.id },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'amount.number': 'O campo valor deve ser um número.',
    'type.enum': 'Favor, selecione um tipo válido.',
    'personId.exists': 'Pessoa não encontrada em sua lista de pessoas.',
    'personId.number': 'O campo personId deve ser um número inteiro.',
  }
}
