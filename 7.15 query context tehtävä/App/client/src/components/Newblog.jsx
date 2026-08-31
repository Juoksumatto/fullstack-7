import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Newblog = ({ onError }) => {
  const title = useField('text')
  const author = useField('author')
  const url = useField('url')
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
              type={title.type}
              value={title.value}
              onChange={title.onChange}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type={author.type}
              value={author.value}
              onChange={author.onChange}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type={url.type}
              value={url.value}
              onChange={url.onChange}
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
