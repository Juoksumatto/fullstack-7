# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests.spec.js >> Blog app >> Login form is shown
- Location: tests\tests.spec.js:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('username')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel('username')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - link "Blogs" [ref=e5] [cursor=pointer]:
      - /url: /blogs
    - link "Login" [ref=e6] [cursor=pointer]:
      - /url: /
    - link "New Blog" [ref=e7] [cursor=pointer]:
      - /url: /blogs/new
  - heading "Login" [level=1] [ref=e8]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - text: "Username:"
      - textbox [ref=e11]
    - generic [ref=e12]:
      - text: "Password:"
      - textbox [ref=e13]
    - button "Login" [ref=e14]
```

# Test source

```ts
  1   | const { test, describe, expect, beforeEach } = require('@playwright/test')
  2   | 
  3   | describe('Blog app', () => {
  4   |   test.describe.configure({ mode: 'serial' })
  5   | 
  6   |   beforeEach(async ({ page, request }) => {
  7   |     await request.post('http://localhost:3003/api/testing/reset')
  8   |     await request.post('http://localhost:3003/api/users', {
  9   |       data: {
  10  |         name: 'No Name',
  11  |         username: 'noname',
  12  |         password: 'yesman'
  13  |       }
  14  |     })
  15  | 
  16  |     await page.goto('http://localhost:5173')
  17  |   })
  18  | 
  19  |   test('Login form is shown', async ({ page }) => {
  20  |     await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
> 21  |     await expect(page.getByLabel('username')).toBeVisible()
      |                                               ^ Error: expect(locator).toBeVisible() failed
  22  |     await expect(page.getByLabel('password')).toBeVisible()
  23  |     await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  24  |   })
  25  | 
  26  |   describe('Login', () => {
  27  |     test('succeeds with correct credentials', async ({ page }) => {
  28  | 
  29  |       await page.getByLabel('username').fill('noname')
  30  |       await page.getByLabel('password').fill('yesman')
  31  |       await page.getByRole('button', { name: 'login' }).click()
  32  | 
  33  |       await expect(page.getByText('No Name logged in')).toBeVisible()
  34  |     })
  35  | 
  36  |     test('fails with wrong credentials', async ({ page }) => {
  37  |       await page.getByLabel('username').fill('')
  38  |       await page.getByLabel('password').fill('')
  39  |       await page.getByRole('button', { name: 'login' }).click()
  40  | 
  41  |       await expect(page.getByText('please enter username and password')).toBeVisible()
  42  |     })
  43  |   })
  44  | 
  45  |   describe('When logged in', () => {
  46  |     beforeEach(async ({ page }) => {
  47  |       await page.getByLabel('username').fill('noname')
  48  |       await page.getByLabel('password').fill('yesman')
  49  |       await page.getByRole('button', { name: 'login' }).click()
  50  |       await expect(page.getByText('No Name logged in')).toBeVisible()
  51  |     })
  52  | 
  53  |     test('a new blog can be created', async ({ page }) => {
  54  |       await page.getByRole('button', { name: 'create new blog' }).click()
  55  | 
  56  |       await page.getByLabel('title').fill('a new blog')
  57  |       await page.getByLabel('author').fill('Onni')
  58  |       await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
  59  |       await page.getByRole('button', { name: /create/i }).click()
  60  | 
  61  |       await expect(page.getByText('Blog created succesfully')).toBeVisible()
  62  |       await expect(page.getByText('a new blog Onni')).toBeVisible()
  63  |     })
  64  | 
  65  |     test('blog can be liked', async ({ page }) => {
  66  |       await page.getByRole('button', { name: 'create new blog' }).click()
  67  |       await page.getByLabel('title').fill('blog')
  68  |       await page.getByLabel('author').fill('onni')
  69  |       await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
  70  |       await page.getByRole('button', { name: /create/i }).click()
  71  |       await expect(page.getByText('Blog created succesfully')).toBeVisible()
  72  | 
  73  |       await page.getByRole('button', { name: /view/i }).first().click()
  74  |       await expect(page.getByText(/Likes: 0/).first()).toBeVisible()
  75  | 
  76  |       const likeButton = page.getByRole('button', { name: /like/i }).first()
  77  |       await likeButton.click()
  78  | 
  79  |       await expect(page.getByText(/Likes: 1/).first()).toBeVisible({ timeout: 10000 })
  80  |     })
  81  | 
  82  |     test('blog can be deleted by the user who created it', async ({ page }) => {
  83  |       await page.getByRole('button', { name: 'create new blog' }).click()
  84  |       await page.getByLabel('title').fill('blog to be deleted')
  85  |       await page.getByLabel('author').fill('Onni Hölttä')
  86  |       await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
  87  |       await page.getByRole('button', { name: /create/i }).click()
  88  |       await expect(page.getByText('Blog created succesfully')).toBeVisible()
  89  | 
  90  |       const viewButtons = page.getByRole('button', { name: 'View' })
  91  |       await viewButtons.last().click()
  92  | 
  93  |       const removeButton = page.getByRole('button', { name: 'remove' }).last()
  94  |       await expect(removeButton).toBeVisible()
  95  | 
  96  |       page.on('dialog', async dialog => {
  97  |         expect(dialog.message()).toContain('Remove blog')
  98  |         await dialog.accept()
  99  |       })
  100 | 
  101 |       await removeButton.click()
  102 | 
  103 |       await expect(page.getByText('blog to be deleted Onni Hölttä')).not.toBeVisible()
  104 |     })
  105 | 
  106 |     test('Only blog creator can see remove button', async ({ page, request }) => {
  107 |       await request.post('http://localhost:3003/api/users', {
  108 |         data: { username: 'mrnobody', name: 'Mr Nobody', password: 'nopassword' }
  109 |       })
  110 | 
  111 |       await page.getByRole('button', { name: 'create new blog' }).click()
  112 |       await page.getByLabel('title').fill('blog to be deleted')
  113 |       await page.getByLabel('author').fill('Onni Hölttä')
  114 |       await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
  115 |       await page.getByRole('button', { name: /create/i }).click()
  116 |       await expect(page.getByText('Blog created succesfully')).toBeVisible()
  117 | 
  118 |       await page.getByRole('button', { name: 'View' }).last().click()
  119 |       await expect(page.getByRole('button', { name: 'remove' }).last()).toBeVisible()
  120 | 
  121 |       await page.getByRole('button', { name: 'logout' }).click()
```