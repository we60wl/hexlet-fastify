import sanitizeHtml from 'sanitize-html';
import _ from 'lodash'
import * as yup from 'yup';

const state = {
  courses: [],
  users: [],
}

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    reply.redirect('/courses')
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

  

  // fastify.post('/users', (req, res) => {
  //   const page = req.query.page
  //     res.send('POST /users')
  // })

  fastify.get('/params', (req, res) => {
    res.send(req.body) // Тело запроса
    res.send(req.headers) // Заголовоки

    res.send(req.query) // Все параметры запросов
    res.send(req.query).name // Параметр запроса name
  })

  // const state = {
  //   users: [
  //     {
  //       id: 1,
  //       username: 'user',
  //       email: 'user@mail.ru'
  //     },
  //     {
  //       id: 2,
  //       username: 'Vladimir',
  //       email: 'naxi03@mail.ru'
  //     }
  //   ],
  //   courses: [
  //     {
  //       id: 1,
  //       title: 'JS: Массивы',
  //       description: 'Курс про массивы в JavaScript',
  //       term: 'Fall'
  //     },
  //     {
  //       id: 2,
  //       title: 'JS: Функции',
  //       description: 'Курс про функции в JavaScript',
  //       term: 'Spring'
  //     },
  //     {
  //       id: 3,
  //       title: 'JS: Объекты',
  //       description: 'Курс про объекты в JavaScript',
  //       term: 'Autumn'
  //     },
  //   ],
  // }

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
    const escapedName = sanitizeHtml(name)
    console.log(1, sanitizeHtml(name))
    res.type('html')
    res.send(`<h1>Hello ${escapedName}</h1>`)
  })

  fastify.get('/courses', (req, res) => {
    const { term } = req.query
    let filteredCourses = state.courses
    if (term && term !== null) {
      filteredCourses = state.courses.filter(course => course.term.toLowerCase().includes(term.toLowerCase()))
    }

    console.log('log', term)

    const data = {
      courses: filteredCourses,
      header: 'Курсы по программированию',
      term
    }
    res.view('src/views/courses/index', data)
  })

  fastify.get('/courses/:id', (req, res) => {
    const { id } = req.params
    const course = state.courses.find(({ id: courseId }) => courseId === id)
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
    const { term } = req.query
    let currentUsers = state.users

    if (term) {
      currentUsers = state.users.filter(user => user.username
        .toLowerCase().includes(term.toLowerCase()))
    }
    res.view('src/views/users/index', { users: currentUsers, term })
  })

  fastify.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = state.users.find(user => user.id === id)
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

  fastify.post('/courses', {
    attachValidation: true,
    schema: {
      body: yup.object({
        title: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
        description: yup.string().min(10)
      })
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
      try {
        const result = schema.validateSync(data)
        return {
          value: result
        }
      } catch (e) {
        return {
          error: e
        }
      }
    }
  }, (req, res) => {
    const {
      title, description
    } = req.body

    if (req.validationError) {
      const data = {
        title, description,
        error: req.validationError
      }
      res.view('src/views/courses/new', data)
      return
    }
  
    const course = { 
      title: title.trim(), 
      description: description, 
      id: _.uniqueId()
    }
  
    state.courses.push(course)
    res.redirect('/courses')
  })

  fastify.delete('/course', (req, res) => {
    const firstCourse = state.courses.find(course => course.name === 'First Course')
    // Это одно и тоже course === firstCourse
    state.courses = _.omitBy(state.courses, course => course.id === firstCourse.id)
    res.send(firstCourse.id)
  })

  fastify.post('/users', {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
        email: yup.string().email(),
        password: yup.string().min(5),
        passwordConfirm: yup.string().min(5)
      })
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
      if (data.password !== data.passwordConfirm) {
        return {
          error: Error('Password confirmation is not equal the password')
        }
      }
      try {
        const result = schema.validateSync(data)
        return {
          value: result
        }
      } catch( e) {
        return {
          error: e
        }
      }
    },
  }, (req, res) => {
    const {
      name,
      email,
      password,
      passwordConfirm,
    } = req.body
  
    if (req.validationError) {
      const data = {
        name, email, password, passwordConfirm,
        error: req.validationError
      }
      res.view('src/views/users/new', data)
      return
    }

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      id: _.uniqueId()
    }

    state.users.push(user)
  
    res.redirect('/users')
  })

  fastify.delete('/users', (req, res) => {
    const firstUser = state.users.find(user => user.name == 'Vladimir')
    state.users = _.omitBy(state.users, user => user.id === firstUser.id)
    res.send(firstUser.id)
  })

  fastify.get('/users/new', (_req, res) => {
    res.view('src/views/users/new')
  })

  fastify.get('/courses/new', (_req, res) => {
    res.view('src/views/courses/new')
  })
}
