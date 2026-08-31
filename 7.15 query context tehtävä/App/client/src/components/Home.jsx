import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useUser } from '../context/user.context'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
      setValue(event.target.value)
    }

    return {
      type,
      value,
      onChange,
    }
  }
const Home = () => {  
  const username = useField('text')
  const password = useField('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setUser, clearUser } = useUser()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const loggedInUser = await loginService.login({
        username: username.value,
        password: password.value ,
      })
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
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
            type={username.type}
            value={username.value}
            onChange={username.onChange}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type={password.type}
            value={password.value}
            onChange={password.onChange}
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
