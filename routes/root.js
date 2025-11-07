export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/welcome', (req, res) => {
    res.type('text/html')
    res.send('<h1>Hello Hexlet</h1>')
  })

  fastify.get('/custom-header', (req, res) => {
    res.header('key', 'value')
    res.code(403)
    res.send()
  })

  fastify.get('/user-json', (req, res) => {
    // res.type('text/html')
    res.send({ userName: 'user1' })
  })

  fastify.get('/admin', (req, reply) => {
    reply.redirect('/', 302)
  })

  

  fastify.post('/users', (req, res) => {
    const page = req.query.page
      res.send('POST /users')
  })

  fastify.get('/params', (req, res) => {
    res.send(req.body) // Тело запроса
    res.send(req.headers) // Заголовоки

    res.send(req.query) // Все параметры запросов
    res.send(req.query).name // Параметр запроса name
  })

  const state = {
    users: [
      {
        id: 1,
        username: 'user',
        email: 'user@mail.ru'
      },
      {
        id: 2,
        username: 'Vladimir',
        email: 'naxi03@mail.ru'
      }
    ],
    courses: [
      {
        id: 1,
        title: 'JS: Массивы',
        description: 'Курс про массивы в JavaScript',
      },
      {
        id: 2,
        title: 'JS: Функции',
        description: 'Курс про функции в JavaScript',
      },
    ],
  }

  fastify.get('/search', (req, res) => {
    const { id } = req.query
    const user = state.users.find(user => user.id === parseInt(id))
    if (!user) {
      res.code(404).send({ message: "User not found" })
    }
    else {
      res.send(user)
    }
  })

  fastify.get('/hello', (req, res) => {
    const { name = 'World' } = req.query
    res.send(`Hello, ${name}!`)
  })

  fastify.get('/courses', (req, res) => {
    const data = {
      courses: state.courses,
      header: 'Курсы по программированию'
    }
    res.view('src/views/courses/index', data)
  })

  fastify.get('/courses/:id', (req, res) => {
    const { id } = req.params
    const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id))
    if (!course) {
      res.code(404).send({ message: 'Course not found' })
      return
    } 
    const data = {
      course,
    }
    // res.send(`Course ID: ${req.params.id}`)
    res.view('src/views/courses/show', data)
  })

  fastify.get('/users', (req, res) => {
    // const page = req.query.page
    // res.send(req.originalUrl)
    const data = {
      users: state.users
    }
    res.view('src/views/users/index', data)
  })

  fastify.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = state.users.find(user => user.id === parseInt(id))
    if (!user) {
      return res.code(404).send({ message: 'User not found'})
    }

    return res.view('src/views/users/show', { user })
  })

  fastify.get('/courses/:courseId/lessons/:id', (req, res) => {
    const { courseId, id } = req.params
    res.send(`Couse ID: ${courseId}, lesson ID: ${id}`)
  })

  fastify.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params
    res.send(`User ID: ${userId}, post ID: ${postId}`)
  })

  fastify.get('/pug-template', (req, res) => {
    res.view('src/views/index')
  })
}
