import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { TextField, Button } from '@mui/material'

const BlogDetail = ({ blogs, likeMutation, removeMutation, currentUser, commentMutation }) => {
  const id = Number(useParams().id)
  const blog = blogs.find((b) => b.id === id)
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([])

  useEffect(() => {
    fetch(`/api/blogs/${id}/comments`)
      .then(response => response.json())
      .then(data => {
        setComments(data)
      })
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]);

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isCreator = currentUser && blog.userId === currentUser.username
  const fetchComments = () => {
    fetch(`/api/blogs/${id}/comments`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error))
  }
  const handleComment = () => {
    if (!comment.trim()) {
      return
    }
    commentMutation.mutate(
      {
        id: blog.id, 
        comment:comment},
      {
        onSuccess: () => {
        setComment('')
        fetchComments()
      }}
    )
  }

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
          Likes: {blog.likes || 0}{' '} <Button variant="contained" onClick={() => likeMutation.mutate(blog.id)}
            disabled={likeMutation.isPending}>{likeMutation.isPending ? 'Liking...' : 'Like'}</Button>
        </p>
        <p>
          <label>
          <TextField 
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            size="small"/>
          <Button
            variant="contained"
            onClick={handleComment}
            size="big">
            Comment
          </Button>
          </label>
        </p>
        <h3>Comments</h3>
        <ul>
          {comments.map((c, index) => (<li key={index}>{c}</li>))}
        </ul>
        {isCreator && <Button variant="contained" onClick={() => removeMutation.mutate(blog.id)}
          disabled={removeMutation.isPending}>{removeMutation.isPending ? 'Deleting...' : 'remove'}</Button>}
        <br />
        <Button variant="contained" component={Link} to="/blogs">Back to blogs</Button>
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
      <p>
        <label>Comment
        <TextField
          label="Comment" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size="small"
          />
        <Button 
          variant="contained"
          onClick={handleComment}>
          Comment
        </Button>
        </label>
      </p>
      <h3>Comments</h3>
      <ul>
        {comments.map((c, index) => (<li key={index}>{c}</li>))}
      </ul>
      {isCreator && <Button onClick={() => removeMutation.mutate(blog.id)}
          disabled={removeMutation.isPending}>{removeMutation.isPending ? 'deleting...' : 'remove'}</Button>}
      <br />
      <Button variant="contained" component={Link} to="/blogs">Back to blogs</Button>
    </div>
  )
}

export default BlogDetail
