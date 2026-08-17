import { useEffect, useState } from 'react'
import anecdoteService from './services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    input: {
      type,
      value,
      onChange
    },
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService
      .getAll()
      .then((data) => setAnecdotes(data))
      .catch((error) => {
        console.error('Failed to fetch anecdotes:', error)
      })
  }, [])

  return { anecdotes, setAnecdotes }
}