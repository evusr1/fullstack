import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'


describe('<Blog/>', () => {
  let container
  const blog = {
    author: 'Author',
    title: 'Title',
    likes: 1337,
    url: 'http://www.test.com/',
    user: {
      name: 'Username'
    }
  }

  const mockLikeHandler = jest.fn()
  const mockRemoveHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        key={blog.id}
        blog={blog}
        handleLike={mockLikeHandler}
        handleRemove={mockRemoveHandler}
        canRemove={ blog.user.name }
      />
    ).container
  })

  describe('render tests', () => {
    test('renders title', async () => {
      screen.getByText(
        'Title', { exact: false }
      )
    })

    test('renders author', async () => {
      screen.getByText(
        'Author', { exact: false }
      )
    })

    test('renders url', async () => {
      screen.getByText(
        'http://www.test.com/', { exact: false }
      )
    })

    test('renders likes', async () => {
      screen.getByText(
        '1337', { exact: false }
      )
    })
  })
  describe('toggle visibility test', () => {
    test('at the start the children are not displayed', () => {
      const div = container.querySelector('.togglableContent')
      expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button show button, url and likes', async () => {
      const user = userEvent.setup()
      const button = screen.getByText('show')
      await user.click(button)

      const div = container.querySelector('.togglableContent')
      expect(div).not.toHaveStyle('display: none')
    })
  })
  describe('test buttons', () => {
    test('press like button twice, check if pressed twice', async () => {
      const user = userEvent.setup()
      const button = screen.getByText('like')
      await user.click(button)
      await user.click(button)

      expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })
  })
})
