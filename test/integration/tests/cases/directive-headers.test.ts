import { test, expect } from 'vitest'
import axios from 'axios'
import { url, headers } from '../config'

/* SPL filter */
const isAuthenticatedMutation = /* GraphQL */ `
  mutation isAuthenticated {
    isAuthenticated @headers(input: [{ key: "Authorization", value: "Bearer token" }]) {
      authenticate
    }
  }
`

test('isAuthenticatedMutation: test directive @headers work properly', async () => {
  const response = await axios.post(url, { query: isAuthenticatedMutation }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result.errors).toBeUndefined()
  expect(result.data.isAuthenticated.authenticate).toBe(true)
})
