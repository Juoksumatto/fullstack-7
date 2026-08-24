import { Link } from 'react-router-dom'
import Blog from './Blog'
import useNotificationStore from '../services/notification'

const Blogs = ({ blogs, user, onLogout, onLike, onRemove }) => {

  const notification = useNotificationStore((state) => state.message)
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/blogs">Blogs</Link>
        {user && <Link to="/blogs/new">new blog</Link>}
        {user ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
      {notification && <p style={{ color: 'red' }}>{notification}</p>}

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
          onLike={onLike}
          onRemove={onRemove}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default Blogs
