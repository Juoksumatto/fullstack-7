import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import Newblog from './components/newblog'
import Home from './components/Home'

const sortBlogsByLikes = (blogs) =>
  [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogsByLikes(blogs.map(b => ({
        ...b,
        userId: b.userId || b.user?.username
      }))))
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
    setErrorMessage(null)
  }

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const handleLike = async (id) => {
    try {
      const updatedBlog = await blogService.like(id)
      setBlogs(sortBlogsByLikes(blogs.map(blog => blog.id === id ? updatedBlog : blog)))
    } catch (error) {
      console.error('Failed to like blog:', error)
      setErrorMessage('Failed to like blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(sortBlogsByLikes(updatedBlogs))
    } catch (error) {
      console.error('Failed to remove blog:', error)
      setErrorMessage('Failed to remove blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
        <Route path="/blogs" element={<Blogs
          blogs={sortBlogsByLikes(blogs)}
          user={user}
          errorMessage={errorMessage}
          onLogout={handleLogout}
          onBlogCreated={handleBlogCreated}
          onError={handleError}
          onLike={handleLike}
          onRemove={handleRemove}
        />} />
        <Route path="/blogs/new" element={<Newblog onBlogCreated={handleBlogCreated} onError={handleError} />} />
        <Route path="/blogs/:id" element={
          <BlogDetail blogs={blogs} onLike={handleLike} onRemove={handleRemove} currentUser={user} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App