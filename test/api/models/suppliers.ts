export type Supplier = {
  id: number
  name: string
}

const generateSuppliers = () => {
  const _suppliers: Supplier[] = []
  for (let i = 1; i <= 10; i++) {
    const supplier: Supplier = {
      id: i,
      name: `Supplier ${i}`
    }
    _suppliers.push(supplier)
  }
  return _suppliers
}

export const suppliers = generateSuppliers()
