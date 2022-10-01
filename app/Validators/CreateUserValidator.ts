import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string([rules.confirmed(), rules.minLength(4)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Favor, preencha o campo nome.',
    'email.required': 'Favor, preencha o campo email.',
    'email.email': 'Favor, preencher com um email valido.',
    'email.unique': 'Email já em uso.',
    'password.required': 'Favor, preencha o campo password.',
    'password.minLength': 'A senha deve conter no mínimo 4 caracteres.',
    'password.maxLength': 'A senha deve conter no máximo 12 caracteres.',
    'password_confirmation.confirmed': 'As senhas não conferem.',
  }
}
