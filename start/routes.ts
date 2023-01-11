import Route from '@ioc:Adonis/Core/Route'

Route.get('', () => 'Finonças 🐆.')

// AUTHENTICATION ROUTES
Route.group(() => {
  Route.get('register', 'UsersController.registerForm')
  Route.post('register', 'UsersController.register')
  Route.get('login', 'UsersController.loginForm')
  Route.post('login', 'UsersController.login')
}).prefix('api/auth/')

Route.group(() => {
  Route.post('/auth/logout', 'UsersController.logout')

  Route.get('dashboard', 'DashboardController.index').as('dashboard')
  Route.get('dashboard/graphics/expenses', 'DashboardController.expensesGraphic')

  // PEOPLE ROUTES
  Route.resource('people', 'PeopleController').apiOnly()

  // EXPENSES ROUTES
  Route.get('expenses/fixeds', 'ExpensesController.findAllFixeds')
  Route.get('expenses/single', 'ExpensesController.findAllSingle')
  Route.resource('expenses', 'ExpensesController').apiOnly().except(['index'])

  // ME ROUTES
  Route.get('me', 'UsersController.me')
  Route.put('me', 'UsersController.updateMe')
})
  .prefix('api/')
  .middleware(['auth'])
