import { useParams, Link } from 'react-router-dom'

const BlogDetail = ({ blogs, likeMutation, removeMutation, currentUser }) => {
  const id = Number(useParams().id)
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isCreator = currentUser && blog.userId === currentUser.username

  if (currentUser) {
    return (
      <div>
        <h2>{blog.title}</h2>
        <p>Author: {blog.author}</p>
        <p>
          URL:{' '}
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </p>
        <p>
          Likes: {blog.likes || 0}{' '} <button onClick={() => likeMutation.mutate(blog.id)}
            disabled={likeMutation.isPending}>{likeMutation.isPending ? 'Liking...' : 'Like'}</button>
        </p>
        {isCreator && <button onClick={() => removeMutation.mutate(blog.id)}
          disabled={removeMutation.isPending}>{removeMutation.isPending ? 'Deleting...' : 'remove'}</button>}
        <br />
        <Link to="/blogs">Back to blogs</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL:{' '}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>Likes: {blog.likes || 0} </p>
      {isCreator && <button onClick={() => removeMutation.mutate(blog.id)}
          disabled={removeMutation.isPending}>{removeMutation.isPending ? 'deleting...' : 'remove'}</button>}
      <br />
      <Link to="/blogs">Back to blogs</Link>
    </div>
  )
}

export default BlogDetail
