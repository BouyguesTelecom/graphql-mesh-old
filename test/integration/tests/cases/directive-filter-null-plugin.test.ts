import { test, expect } from 'vitest'
import axios from 'axios'
import { url, headers } from '../config'

/* Filter null values from response with filterNull: true in config.yaml */
const getSuppliersWithNull = /* GraphQL */ `
  query getSuppliers {
    getSuppliers {
      items {
        id
        name
        address
      }
    }
  }
`

test('getSuppliersWithNull: filter null values from response', async () => {
  const response = await axios.post(url, { query: getSuppliersWithNull }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result.errors).toBeUndefined()
  expect(result.data.getSuppliers).toEqual({
    items: [
      {
        id: 1,
        name: 'Supplier 1'
      },
      {
        id: 2,
        name: 'Supplier 2'
      },
      {
        id: 3,
        name: 'Supplier 3'
      },
      {
        id: 4,
        name: 'Supplier 4'
      },
      {
        id: 5,
        name: 'Supplier 5'
      },
      {
        id: 6,
        name: 'Supplier 6'
      },
      {
        id: 7,
        name: 'Supplier 7'
      },
      {
        id: 8,
        name: 'Supplier 8'
      },
      {
        id: 9,
        name: 'Supplier 9'
      },
      {
        id: 10,
        name: 'Supplier 10'
      }
    ]
  })
})
