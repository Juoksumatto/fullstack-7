import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useUser } from '../context/user.context'
import { TextField, Button, Toolbar, AppBar } from '@mui/material'

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
        <AppBar position='static'>
          <Toolbar style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Button variant="contained" component={Link} to="/blogs">Blogs</Button>
            <Button variant="contained" component={Link} to="/users">Users</Button>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <h1>Welcome, {user.name || user.username}!</h1>
      </div>
    )
  }

  return (
    <div>
      <AppBar position='static'>
        <Toolbar style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="contained" component={Link} to="/blogs">Blogs</Button>
          <Button variant="contained" component={Link} to="/">Login</Button>
          <Button variant="contained" component={Link} to="/blogs/new">New Blog</Button>
        </Toolbar>
      </AppBar>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            size="small"
            type={username.type}
            value={username.value}
            onChange={username.onChange}
          />
        </div>
        <div>
          <TextField
            size="small"
            label="Password"
            type={password.type}
            value={password.value}
            onChange={password.onChange}
            required
          />
        </div>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}

export default Home
