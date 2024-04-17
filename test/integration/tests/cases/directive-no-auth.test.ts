import { test, expect } from 'vitest'
import axios from 'axios'
import { url, headers } from '../config'

/* SPL filter */
const isAuthenticatedMutation = /* GraphQL */ `
  mutation isAuthenticated {
    isAuthenticated @noAuth {
      authenticate
    }
  }
`

// Add Authorization header
const _headers = {
  ...headers,
  Authorization: 'Bearer token'
}
test('isAuthenticatedMutation: test directive @noAuth properly remove authorization header', async () => {
  const response = await axios.post(url, { query: isAuthenticatedMutation }, { headers: _headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result.errors).toBeUndefined()
  expect(result.data.isAuthenticated.authenticate).toBe(false)
})
