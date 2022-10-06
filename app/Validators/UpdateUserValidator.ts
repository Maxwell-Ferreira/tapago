import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional(),
    email: schema.string.optional([
      rules.email(),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.ctx.auth.user!.id } }),
    ]),
    password: schema.string.optional([rules.confirmed(), rules.minLength(4)]),
    monthlyLimit: schema.number.optional(),
  })

  public messages: CustomMessages = {
    'email.email': 'Favor, preencher com um email valido.',
    'email.unique': 'Email já em uso.',
    'password.minLength': 'A senha deve conter no mínimo 4 caracteres.',
    'password.maxLength': 'A senha deve conter no máximo 12 caracteres.',
    'password_confirmation.confirmed': 'As senhas não conferem.',
    'monthlyLimit.number': 'O Limite de Gastos Desejado deve ser um número.',
  }
}
