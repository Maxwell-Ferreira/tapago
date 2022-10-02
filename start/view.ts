import View from '@ioc:Adonis/Core/View'
import { format } from 'date-fns'

View.global('baseUrl', () => process.env.APP_URL)

View.global('formatDate', (date: Date | string) =>
  date ? format(new Date(date), 'dd/MM/yyyy') : ''
)

View.global('currency', (amount: number | string) =>
  Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
)

View.global('stringfy', (value: any) => JSON.stringify(value))
