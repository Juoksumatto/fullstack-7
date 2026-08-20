import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Newblog from './Newblog'
import { test, expect, vi } from 'vitest'

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
    setToken: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    like: vi.fn(),
    remove: vi.fn()
  }
}))

import blogService from '../services/blogs'

describe('Newblog', () => {
  test('calls correct prop when blog created', async () => {
    const mockOnBlogCreated = vi.fn()
    const mockOnError = vi.fn()
    const user = userEvent.setup()

    const createdBlog = {
      id: '123',
      title: 'this is a blog',
      author: 'Onni Hölttä',
      url: 'https://github.com/Juoksumatto/fullstack-5',
      likes: 0
    }

    blogService.create.mockResolvedValue(createdBlog)

    render(
      <Newblog
        onBlogCreated={mockOnBlogCreated}
        onError={mockOnError}
      />
    )

    const openFormButton = screen.getByRole('button', { name: /create new blog/i })
    await user.click(openFormButton)

    const titleInput = screen.getByLabelText(/title:/i)
    const authorInput = screen.getByLabelText(/author:/i)
    const urlInput = screen.getByLabelText(/url:/i)

    await user.type(titleInput, 'this is a blog')
    await user.type(authorInput, 'Onni Hölttä')
    await user.type(urlInput, 'https://github.com/Juoksumatto/fullstack-5')

    const createButton = screen.getByRole('button', { name: /^create$/i })
    await user.click(createButton)

    await vi.waitFor(() => {
      expect(mockOnBlogCreated).toHaveBeenCalledTimes(1)
    })

    expect(mockOnBlogCreated).toHaveBeenCalledWith(createdBlog)
    expect(mockOnError).not.toHaveBeenCalled()
  })
})