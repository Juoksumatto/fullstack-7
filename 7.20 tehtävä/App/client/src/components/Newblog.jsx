import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TextField, Button, Toolbar, AppBar } from '@mui/material'

const Newblog = ({ onError }) => {
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

  const title = useField('text')
  const author = useField('author')
  const url = useField('text')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),

    onSuccess: (newBlog) => {
      queryClient.setQueryData(
        ['blogs'],
        (oldBlogs = []) => [...oldBlogs, newBlog],)

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

    if (!title.value || !author.value || !url.value) {
      onError('please fill in all fields')
      return
    }

    mutation.mutate({
      title: title.value,
      author: author.value,
      url: url.value,
    })
  }

  return (
    <div>
      <Button variant="contained" component={Link} to="/blogs">Back to blogs</Button>
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
            <TextField
              label="Title:"
              size="small"
              type={title.type}
              value={title.value}
              onChange={title.onChange}
            />
        </div>
        <div>
            <TextField
              label="Author:"
              size="small"
              type={author.type}
              value={author.value}
              onChange={author.onChange}
            />
        </div>
        <div>
            <TextField
              label="url:"
              size="small"
              type={url.type}
              value={url.value}
              onChange={url.onChange}
            />
        </div>
        <div>
          <Button variant="contained" type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'creating...' : 'create'}</Button>
        </div>
      </form>
    </div>
  )
}

export default Newblog
