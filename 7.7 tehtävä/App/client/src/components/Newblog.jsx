import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const Newblog = ({ onBlogCreated, onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title || !author || !url) {
      onError('please fill in all fields')
      return
    }

    try {
      const newBlog = await blogService.create({ title, author, url })
      onBlogCreated(newBlog)
      setSuccessMessage('Blog created succesfully' )
      setTitle('')
      setAuthor('')
      setUrl('')

      setTimeout(() => {
        setSuccessMessage('')
        navigate('/blogs')
      }, 3000)
    } catch {
      onError('blog creation failed')
    }
  }

  return (
    <div>
      <Link to="/blogs">Back to blogs</Link>
      <h2>Create a new blog</h2>

      {successMessage && (
        <div style={{
          color: 'green',
          background: 'lightgrey',
          fontSize: '20px',
          borderStyle: 'solid',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '10px'
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label> title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)} />
          </label>
        </div>
        <div>
          <label> author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label> url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default Newblog