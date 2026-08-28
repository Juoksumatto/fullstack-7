import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Newblog = ({ onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),

    onSuccess: (newBlog) => {
      queryClient.setQueryData(
        ['blogs'],
        (oldBlogs = []) => [...oldBlogs, newBlog],)

        setTitle('')
        setAuthor('')
        setUrl('')
        setSuccessMessage('Blog created succesfully')

        setTimeout(() => {
          setSuccessMessage('')
          navigate('/blogs')
        }, 3000)  
    },
    onError: () => {
      onError('Blog creation failed')
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title || !author || !url) {
      onError('please fill in all fields')
      return
    }

    mutation.mutate({
      title,
      author,
      url,
    })
  }

  return (
    <div>
      <Link to="/blogs">Back to blogs</Link>
      <h2>Create a new blog</h2>

      {successMessage && (
        <div
          style={{
            color: 'green',
            background: 'lightgrey',
            fontSize: '20px',
            borderStyle: 'solid',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'creating...' : 'create'}</button>
        </div>
      </form>
    </div>
  )
}

export default Newblog
