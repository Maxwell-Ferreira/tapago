import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Charge from './Charge'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Charge)
  public charge: BelongsTo<typeof Charge>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
