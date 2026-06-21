// e2e/core-loop.spec.ts
import { test, expect } from '@playwright/test'

test('signup, post, like, comment, start event, join event', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('Display name').fill('E2E Tester')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL('/')

  // Use page.request (not the worker-scoped request fixture) so the signup
  // session cookies are sent along with the API call.
  const createRes = await page.request.post('/api/posts', {
    data: { videoId: 'e2e-video-1', caption: 'Pothole on Main St' },
  })
  const post = await createRes.json()

  await page.request.post('/api/webhooks/cloudflare-stream', {
    headers: { 'webhook-secret': process.env.CF_STREAM_WEBHOOK_SECRET ?? '' },
    data: { uid: 'e2e-video-1', status: { state: 'ready' }, thumbnail: 'https://thumb.example/e2e.jpg' },
  })

  await page.goto(`/post/${post.id}`)
  await expect(page.getByText('Pothole on Main St')).toBeVisible()

  await page.getByRole('button', { name: 'Like' }).click()
  await expect(page.getByRole('button', { name: 'Liked' })).toBeVisible()

  await page.getByPlaceholder('Add a comment').fill('Saw this too, it\'s getting worse')
  await page.getByRole('button', { name: 'Post', exact: true }).click()
  await expect(page.getByText("Saw this too, it's getting worse")).toBeVisible()

  await page.getByRole('button', { name: 'Start event' }).click()
  await page.getByLabel('Title').fill('Report to city council')
  await page.getByRole('button', { name: 'Start event' }).click()

  await expect(page.getByRole('button', { name: 'Joined' })).toBeVisible()
})
