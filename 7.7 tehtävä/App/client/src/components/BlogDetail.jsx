import { useParams, Link } from 'react-router-dom'

const BlogDetail = ({ blogs, onLike, onRemove, currentUser }) => {
  const id = Number(useParams().id)
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleLike = async () => {
    try {
      await onLike(blog.id)
    } catch (error) {
      console.error('Failed to like blog:', error)
    }
  }

  const handleRemove = async () => {
    try {
      await onRemove(blog.id)
    } catch (error) {
      console.error('Failed to remove blog:', error)
    }
  }

  const isCreator =
    currentUser &&
    blog.userId === currentUser.username

  if (currentUser) {
    return (
      <div>
        <h2>{blog.title}</h2>
        <p>Author: {blog.author}</p>
        <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
        <p>Likes: {blog.likes || 0} <button onClick={handleLike}>Like</button></p>
        {isCreator && <button onClick={handleRemove}>remove</button>}
        <br />
        <Link to="/blogs">Back to blogs</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
      <p>Likes: {blog.likes || 0} </p>
      {isCreator && <button onClick={handleRemove}>remove</button>}
      <br />
      <Link to="/blogs">Back to blogs</Link>
    </div>
  )
}

export default BlogDetail