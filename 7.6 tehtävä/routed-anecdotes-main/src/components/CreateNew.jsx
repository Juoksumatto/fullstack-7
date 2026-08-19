import { useNavigate } from 'react-router-dom'
import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await addAnecdote({ 
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0,
    })
    
    navigate('/')

  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.input} />
        </div>
        <div>
          author
          <input {...author.input} />
        </div>
        <div>
          url for more info
          <input {...info.input} />
        </div>
        <button>create</button>
        <button
          type="button"
          onClick={() => {
            content.reset()
            author.reset()
            info.reset()
          }}
        >
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew
