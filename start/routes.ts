import Route from '@ioc:Adonis/Core/Route'

// AUTHENTICATION ROUTES
Route.group(() => {
  Route.get('register', 'UsersController.registerForm')
  Route.post('register', 'UsersController.register')
  Route.get('login', 'UsersController.loginForm')
  Route.post('login', 'UsersController.login')
}).prefix('auth/')

Route.group(() => {
  Route.get('/auth/logout', 'UsersController.logout')

  Route.get('/', 'DashboardController.index').as('dashboard')

  // PEOPLE ROUTES
  Route.resource('people', 'PeopleController')

  // EXPENSES ROUTES
  Route.get('expenses/fixeds', 'ExpensesController.findAllFixeds')
  Route.get('expenses/single', 'ExpensesController.findAllSingle')
  Route.resource('expenses', 'ExpensesController')
}).middleware(['auth'])
