import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import Newblog from './components/newblog'
import Home from './components/Home'
import { useNotification } from './context/notification.context'
import useUserStore from './services/userStore'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  const [notification, notificationDispatch] = useNotification()

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [setUser])

  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (isLoading) return <p>Loading blogs...</p>
  if (isError) return <p>Error loading blogs</p>

  const handleLogout = () => {
    clearUser()
    localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const handleLoginSuccess = (user) => {
    setUser(user)
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
  }

  const notify = (message, seconds = 5) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      data: message,
    })

    setTimeout(() => {
      notificationDispatch({
        type: 'CLEAR_NOTIFICATION',
      })
    }, seconds * 1000)
  }

  const handleError = (message) => {
    notify(message, 5)
  }

  const handleLike = async (id) => {
    try {
      await blogService.like(id)
    } catch (error) {
      console.error('Failed to like blog:', error)
      notify('Failed to like blog', 5)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
    } catch (error) {
      console.error('Failed to remove blog:', error)
      notify('Failed to remove blog', 5)
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
                blogs={blogs}
                user={user}
                onLogout={handleLogout}
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
