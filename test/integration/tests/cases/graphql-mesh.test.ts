import { test, expect } from 'vitest'
import axios from 'axios'
import { url, headers } from '../config'

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
  expect(result.data.getProductById.supplier.name).contains('Supplier 2')
})

/* Linklist property */

const getProductwithLinkList = /* GraphQL */ `
  query getProductWithLinkList {
    getProductById(id: 1) {
      supplierId
      _linksList {
        rel
        href
      }
    }
  }
`

test('Follow hateoas link to get Suppier info', async () => {
  const response = await axios.post(url, { query: getProductwithLinkList }, { headers })

  const result = response.data
  expect(result.data.getProductById._linksList.length).toEqual(2)
  expect(result.data.getProductById._linksList).toEqual([
    {
      rel: 'self',
      href: '/products/1'
    },
    {
      rel: 'supplier',
      href: '/suppliers/2'
    }
  ])
})
