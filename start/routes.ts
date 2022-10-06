import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// AUTHENTICATION ROUTES
Route.group(() => {
  Route.get('register', 'UsersController.registerForm')
  Route.post('register', 'UsersController.register')
  Route.get('login', 'UsersController.loginForm')
  Route.post('login', 'UsersController.login')
}).prefix('auth/')

Route.group(() => {
  Route.get('/auth/logout', 'UsersController.logout')

  Route.get('/', ({ response }: HttpContextContract) => response.redirect('/dashboard'))
  Route.get('/dashboard', 'DashboardController.index').as('dashboard')
  Route.get('/dashboard/graphics/expenses', 'DashboardController.expensesGraphic')

  // PEOPLE ROUTES
  Route.resource('people', 'PeopleController')

  // EXPENSES ROUTES
  Route.get('expenses/fixeds', 'ExpensesController.findAllFixeds')
  Route.get('expenses/single', 'ExpensesController.findAllSingle')
  Route.resource('expenses', 'ExpensesController')

  // ME ROUTES
  Route.get('/me', 'UsersController.me')
  Route.put('/me', 'UsersController.updateMe')
}).middleware(['auth'])
