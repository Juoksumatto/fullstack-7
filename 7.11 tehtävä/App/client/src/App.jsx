import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import Newblog from './components/newblog'
import Home from './components/Home'
import useNotificationStore from './services/notification'

const sortBlogsByLikes = (blogs) =>
  [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  )

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) =>
      setBlogs(
        sortBlogsByLikes(
          blogs.map((b) => ({
            ...b,
            userId: b.userId || b.user?.username,
          })),
        ),
      ),
    )
  }, [user])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const handleLoginSuccess = (user) => {
    setUser(user)
  }

  const handleBlogCreated = (newBlog) => {
    setBlogs(sortBlogsByLikes(blogs.concat(newBlog)))
  }

  const handleError = (message) => {
    setNotification(message, 5)
  }

  const handleLike = async (id) => {
    try {
      const updatedBlog = await blogService.like(id)
      setBlogs(
        sortBlogsByLikes(
          blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
        ),
      )
    } catch (error) {
      console.error('Failed to like blog:', error)
      setNotification('Failed to like blog', 5)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(sortBlogsByLikes(updatedBlogs))
    } catch (error) {
      console.error('Failed to remove blog:', error)
      setNotification('Failed to remove blog', 5)
    }
  }

  return (
    <BrowserRouter>
      <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/blogs"
            element={
              <Blogs
                blogs={sortBlogsByLikes(blogs)}
                user={user}
                onLogout={handleLogout}
                onBlogCreated={handleBlogCreated}
                onError={handleError}
                onLike={handleLike}
                onRemove={handleRemove}
              />
            }
          />
          <Route
            path="/blogs/new"
            element={
              <Newblog
                onBlogCreated={handleBlogCreated}
                onError={handleError}
              />
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetail
                blogs={blogs}
                onLike={handleLike}
                onRemove={handleRemove}
                currentUser={user}
              />
            }
          />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
