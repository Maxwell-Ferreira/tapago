import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExpensesReports from 'App/Reports/ExpensesReports'

export default class DashboardController {
  private ALLOWED_MODES = ['sevenDays', 'thirtyDays', 'lastYear']

  public async expensesGraphic({ request, auth }: HttpContextContract) {
    let mode = request.qs().mode as string
    if (!this.ALLOWED_MODES.includes(mode)) mode = 'sevenDays'

    if (mode === 'sevenDays') return ExpensesReports.days(7, auth.user)
    else if (mode === 'thirtyDays') return ExpensesReports.days(30, auth.user)
    else if (mode === 'lastYear') return ExpensesReports.lastYear(auth.user)
  }
}
