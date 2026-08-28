import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useUser } from '../context/user.context'

const Home = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setUser, clearUser } = useUser()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const loggedInUser = await loginService.login({ username, password })
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      navigate('/blogs')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearUser()
    blogService.setToken(null)
  }

  if (user) {
    return (
      <div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link to="/blogs">Blogs</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Welcome, {user.name || user.username}!</h1>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/blogs">Blogs</Link>
        <Link to="/">Login</Link>
        <Link to="/blogs/new">New Blog</Link>
      </div>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Home
