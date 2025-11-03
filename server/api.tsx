import { Hono } from 'hono'

const app = new Hono()

// e.g. http://localhost:5173/api/books
app.get('/api/books', (c) => {
  return c.json([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
  ])
})

export default app
