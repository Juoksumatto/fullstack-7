import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
  }

  return (
    <div className="blog" style={blogStyle}>
      <Button variant="contained" component={Link} to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}
      </Button>
    </div>
  )
}

export default Blog
