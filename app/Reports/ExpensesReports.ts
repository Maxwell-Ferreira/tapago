import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { addDays, addMonths, format, subDays, subYears } from 'date-fns'

export default class ExpensesReports {
  public static async days(days = 7 | 30, user?: User) {
    const consult = await user
      ?.related('expenses')
      .query()
      .select(Database.raw('day(created_at) as day, month(created_at) as month'))
      .sum('amount', 'amount')
      .where('type', 'SINGLE')
      .groupBy(['day', 'month'])
      .orderBy('createdAt', 'asc')
      .limit(days)

    let result: any[] = []
    const now = new Date()

    const daysAgo = subDays(now, days - 1)

    for (let i = 0; i < days; i++) {
      const date = addDays(daysAgo, i)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')

      const amount =
        consult?.find(
          (item) => item.$extras.day === Number(day) && item.$extras.month === Number(month)
        )?.amount || 0

      result.push({ amount: Number(amount), day, month })
    }

    return result
  }

  public static async lastYear(user?: User) {
    const minDate = subYears(new Date(), 1)

    const consult = await user
      ?.related('expenses')
      .query()
      .select(Database.raw('month(created_at) as month, year(created_at) as year'))
      .sum('amount', 'amount')
      .where('type', 'SINGLE')
      .where('createdAt', '>=', format(minDate, 'yyyy-MM-dd'))
      .groupBy(['month', 'year'])
      .orderBy('createdAt', 'asc')
      .limit(12)

    let result: any[] = []
    const now = new Date()

    const aYearAgo = subYears(now, 1)

    for (let i = 1; i < 13; i++) {
      const date = addMonths(aYearAgo, i)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()

      const amount =
        consult?.find(
          (item) => item.$extras.month === Number(month) && item.$extras.year === Number(year)
        )?.amount || 0

      result.push({ amount: Number(amount), month, year })
    }

    return result
  }
}
