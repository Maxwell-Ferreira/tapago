import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Person from './Person'

enum Type {
  SINGULAR = 'SINGULAR',
  RECURRENT = 'RECURRENT'
}

export default class Charge extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public type: Type

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Person)
  public people: ManyToMany<typeof Person>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
