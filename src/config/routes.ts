export const routes: Array<SocotraRoute> = [
  {
    path: '/',
    method: 'GET',
    controller: 'index',
    middlewares: ['auth']
  },
  {
    path: '/unsubscribe/:userID',
    controller: 'unsubscribe',
    middlewares: []
  },
  {
    path: '/activation/:activationKey',
    controller: 'activation',
    middlewares: []
  },
  {
    path: '/api/signup',
    controller: 'signupAPI',
    middlewares: []
  },
  {
    path: '/api/login',
    controller: 'loginAPI',
    middlewares: [],
    params: {
      username: {
        type: 'email',
        required: true,
        maxLength: 50,
        minLength: 20,
        toLowerCase: true,
        // toUpperCase: true

      },
      password: {
        type: 'string',
        required: true
      }
    }
  }
]
