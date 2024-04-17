import { test, expect } from 'vitest'
import axios from 'axios'
import { url, headers } from '../config'

/* SPL filter */
const getTenFirstProductsQuery = /* GraphQL */ `
  query getTenFirstProducts {
    getProducts {
      items @SPL(query: "id <= 10") {
        name
        id
        price
        supplierId
      }
    }
  }
`

test('getTenFirstProductsQuery: test SPL filter inside query', async () => {
  const response = await axios.post(url, { query: getTenFirstProductsQuery }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result.errors).toBeUndefined()
  expect(result.data.getProducts.items.length).toEqual(10)
})
