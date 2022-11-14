import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Person from './Person'
import Payment from './Payment'

export enum Type {
  SINGULAR = 'SINGULAR',
  RECURRENT = 'RECURRENT',
}

enum TranslatedTypes {
  SINGULAR = 'AVULSA',
  RECURRENT = 'RECORRENTE',
}

export default class Charge extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public type: Type

  @computed()
  public get typeLabel() {
    return TranslatedTypes[this.type]
  }

  @column()
  public amount: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Person)
  public people: BelongsTo<typeof Person>

  @hasMany(() => Payment)
  public payments: HasMany<typeof Payment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
