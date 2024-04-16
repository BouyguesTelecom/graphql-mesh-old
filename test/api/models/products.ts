type Product = {
  id: number
  name: string
  price: number
  supplierId: number
  _links: {
    supplier: {
      href: string
    }
    self?: {
      href: string
    }
  }
}

function generateProducts() {
  const _products: Product[] = []
  for (let i = 1; i <= 50; i++) {
    const supplierId = (i % 10) + 1
    const product: Product = {
      id: i,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 100),
      supplierId,
      _links: {
        self: {
          href: `/products/${i}`
        },
        supplier: {
          href: `/suppliers/${supplierId}`
        }
      }
    }
    _products.push(product)
  }
  return _products
}

export const products = generateProducts()
