import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([rules.email()]),
    password: schema.string([rules.minLength(4), rules.maxLength(12)]),
  })

  public messages: CustomMessages = {
    'email.required': 'Favor, preencha o campo email.',
    'email.email': 'Favor, preencher com um email valido.',
    'password.required': 'Favor, preencha o campo password.',
    'password.minLength': 'A senha deve conter no mínimo 4 caracteres.',
    'password.maxLength': 'A senha deve conter no máximo 12 caracteres.',
  }
}
