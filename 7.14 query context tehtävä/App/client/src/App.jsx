import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import Newblog from './components/newblog'
import Home from './components/Home'
import { useNotification } from './context/notification.context'
import { useUser } from './context/user.context'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'

const App = () => {
  const { user, clearUser } = useUser()
  const [notification, notificationDispatch] = useNotification()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (user?.token) {
      blogService.setToken(user.token)
    }
  }, [user])

  const notify = (message, seconds = 5) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', data: message })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, seconds * 1000)
  }

  const handleError = (message) => notify(message, 5)

  const likeMutation = useMutation({
    mutationFn: (id) => blogService.like(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: () => handleError('Failed to like the blog'),
  })

  const removeMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: () => handleError('Failed to remove blog'),
  })

  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const handleLogout = () => {
    clearUser()
    blogService.setToken(null)
  }

  if (isLoading) return <p>Loading blogs...</p>
  if (isError) return <p>Error loading blogs</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/blogs"
          element={
            <Blogs
              blogs={blogs}
              user={user}
              onLogout={handleLogout}
              onError={handleError}
              likeMutation={likeMutation}
              removeMutation={removeMutation}
            />
          }
        />
        <Route path="/blogs/new" element={<Newblog onError={handleError} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={blogs}
              likeMutation={likeMutation}
              removeMutation={removeMutation}
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
