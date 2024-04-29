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

test('getAllProductsQuery: query working properly', async () => {
  const response = await axios.post(url, { query: getAllProductsQuery }, { headers })

  const result = response.data
  expect(response.status).toBe(200)
  expect(result).toHaveProperty('data')
  expect(result.errors).toBeUndefined()
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

test('getProductAndSupplierInfo: follow hateoas link', async () => {
  const response = await axios.post(url, { query: getProductAndSupplierInfo }, { headers })

  const result = response.data
  expect(result.errors).toBeUndefined()
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

test('getProductwithLinkList: Get "_linksList" attributes', async () => {
  const response = await axios.post(url, { query: getProductwithLinkList }, { headers })

  const result = response.data
  expect(result.errors).toBeUndefined()
  expect(result.data.getProductById).toHaveProperty('_linksList')
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

/* Actionslist property */
const getProductwithActionList = /* GraphQL */ `
  query getProductWithLinkList {
    getProductById(id: 1) {
      supplierId
      _actionsList {
        rel
        action
      }
    }
  }
`
test('getProductwithActionList: Get "_linksList" attributes', async () => {
  const response = await axios.post(url, { query: getProductwithActionList }, { headers })

  const result = response.data
  expect(result.errors).toBeUndefined()
  expect(result.data.getProductById).toHaveProperty('_actionsList')
  expect(result.data.getProductById._actionsList.length).toEqual(2)
  expect(result.data.getProductById._actionsList).toEqual([
    {
      rel: 'update',
      action: '/products/add/1'
    },
    {
      rel: 'delete',
      action: '/products/delete/1'
    }
  ])
})
