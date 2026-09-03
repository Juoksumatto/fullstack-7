import { Link } from 'react-router-dom'
import Blog from './Blog'
import { useNotification } from '../context/notification.context'
import { TextField, Button, AppBar, Toolbar } from '@mui/material'

const Blogs = ({ blogs, user, onLogout, likeMutation, removeMutation }) => {
  const [notification] = useNotification()

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="contained" component={Link} to="/blogs">
            Blogs
          </Button>
          <Button variant="contained" component={Link} to="/users">
            Users
          </Button>
          {user && <Button variant="contained" size="small" component={Link} to="/blogs/new">
            new blog
          </Button>}
          {user ? (
            <Button 
              variant="contained" 
              size="small" 
              onClick={onLogout}>Logout</Button>
          ) : (
            <Button variant="contained" component={Link} to="/">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      {notification && (<p style={{ color: 'red' }}>{notification}</p>)}

      {user ? (
        <p>
          {user.name ? `${user.name} logged in` : `${user.username} logged in`}
        </p>
      ) : (
        <p>Login to create blogs</p>
      )}

      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeMutation={likeMutation}
          removeMutation={removeMutation}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default Blogs
