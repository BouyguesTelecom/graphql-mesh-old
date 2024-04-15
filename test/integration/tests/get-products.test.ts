import { test, expect } from 'vitest'
import axios from 'axios'

const url = 'http://127.0.0.1:45538/graphql'
const headers = { 'Content-Type': 'application/json' }

/* Get all products */
const getAllProductsQuery = /* GraphQL */ `
  query getAllProducts {
    getProducts {
      items {
        name
        id
        price
        supplierId
      }
    }
  }
`

test('getAllProducts query', async () => {
  const response = await axios.post(url, { query: getAllProductsQuery }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result).toHaveProperty('data')
  expect(result.data).toHaveProperty('getProducts')
  expect(result.data.getProducts.items.length).toEqual(50)
})

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

test('getTenFirstProducts with SPL filter query', async () => {
  const response = await axios.post(url, { query: getTenFirstProductsQuery }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result.data.getProducts.items.length).toEqual(10)
})

/* Hateoas link */
const getProductAndSupplierInfo = /* GraphQL */ `
  query getProductAndSupplierInfo {
    getProductById(id: 1) {
      id
      name
      price
      supplier {
        name
        id
      }
    }
  }
`

test('Follow hateoas link to get Suppier info', async () => {
  const response = await axios.post(url, { query: getProductAndSupplierInfo }, { headers })

  const result = response.data
  expect(result.data.getProductById.supplier.name).contains('Supplier')
})
