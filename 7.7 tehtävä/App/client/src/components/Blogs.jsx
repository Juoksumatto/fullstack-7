import { Link } from 'react-router-dom'
import Blog from './Blog'

const Blogs = ({
  blogs,
  user,
  errorMessage,
  onLogout,
  onLike,
  onRemove
}) => {
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {user ? (
        <p>{user.name ? `${user.name} logged in` : `${user.username} logged in`}</p>
      ) : (
        <p>Login to create blogs</p>
      )}

      <h2>blogs</h2>
      {blogs.map(blog => (
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
