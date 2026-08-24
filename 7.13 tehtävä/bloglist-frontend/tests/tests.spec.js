const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  test.describe.configure({ mode: 'serial' })

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'No Name',
        username: 'noname',
        password: 'yesman'
      }
    })

    await page.goto('http://localhost:5174')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[type="text"]').fill('noname')
      await page.locator('input[type="password"]').fill('yesman')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('No Name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[type="text"]').fill('noname')
      await page.locator('input[type="password"]').fill('wrong')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[type="text"]').fill('noname')
      await page.locator('input[type="password"]').fill('yesman')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('No Name logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await expect(page.getByRole('heading', { name: 'Create a new blog' })).toBeVisible()

      await page.getByLabel('title:').fill('a new blog')
      await page.getByLabel('author:').fill('Onni')
      await page.getByLabel('url:').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Blog created succesfully')).toBeVisible()
      await expect(page.getByText('a new blog by Onni')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('blog to like')
      await page.getByLabel('author:').fill('Onni')
      await page.getByLabel('url:').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      await page.getByRole('link', { name: 'blog to like by Onni' }).click()
      await expect(page.getByRole('heading', { name: 'blog to like' })).toBeVisible()
      await expect(page.getByText('Likes: 0')).toBeVisible()

      await page.getByRole('button', { name: 'Like' }).click()
    })

    test('blog can be deleted by the user who created it', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('blog to be deleted')
      await page.getByLabel('author:').fill('Onni')
      await page.getByLabel('url:').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      await page.getByRole('link', { name: 'blog to be deleted by Onni' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog not found')).toBeVisible()
    })
  })
})