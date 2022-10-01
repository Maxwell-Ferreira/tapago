import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateExpenseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number(),
    type: schema.enum(['FIXED', 'SINGLE']),
    expiresIn: schema.date.optional({ format: 'yyyy-MM-dd' }, [
      rules.afterOrEqual('today'),
    ]),
  });

  public messages: CustomMessages = {};
}
