import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Type } from 'App/Models/Charge'

export default class CreateChargeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number(),
    description: schema.string(),
    type: schema.enum(Object.values(Type)),
    personId: schema.number([
      rules.exists({
        table: 'people',
        column: 'id',
        where: { user_id: this.ctx.auth.user?.id },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'amount.required': 'Favor, preencha o campo Valor.',
    'amount.number': 'O campo valor deve ser um número.',
    'description.required': 'Favor, preencha o campo Descrição.',
    'type.required': 'Favor, selecione um tipo.',
    'type.enum': 'Favor, selecione um tipo válido.',
    'personId.required': 'Favor, selecionar a pessoa relacionada.',
    'personId.exists': 'Pessoa não encontrada em sua lista de pessoas.',
    'personId.number': 'O campo personId deve ser um número inteiro.',
  }
}
