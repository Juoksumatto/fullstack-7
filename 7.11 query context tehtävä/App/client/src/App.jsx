import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import Newblog from './components/newblog'
import Home from './components/Home'
import { useNotification } from './context/notification.context'
import useBlogStore from './services/blogstore'
import useUserStore from './services/userStore'

const sortBlogsByLikes = (blogs) =>
  [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))

const App = () => {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)
  const blogs = useBlogStore((state) => state.blogs)
  const setBlogs = useBlogStore((state) => state.setBlogs)
  const addBlog = useBlogStore((state) => state.addBlog)

  const [notification, notificationDispatch] = useNotification()

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [setUser])

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
    clearUser()
    localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const handleLoginSuccess = (user) => {
    setUser(user)
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
  }

  const handleBlogCreated = (newBlog) => {
    addBlog(newBlog)
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
      const updatedBlog = await blogService.like(id)
      setBlogs(
        sortBlogsByLikes(
          blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
        ),
      )
    } catch (error) {
      console.error('Failed to like blog:', error)
      notify('Failed to like blog', 5)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(sortBlogsByLikes(updatedBlogs))
    } catch (error) {
      console.error('Failed to remove blog:', error)
      notification('Failed to remove blog', 5)
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
