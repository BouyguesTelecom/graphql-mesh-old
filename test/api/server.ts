import express from 'express'
import { products } from './models/products'
import { suppliers } from './models/suppliers'
import swaggerUi from 'swagger-ui-express'
import Yaml from 'yamljs'

const app = express()
const port = 5000
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`)
})

app.use(express.json())

// Serve the swagger.yml file
app.use('/api-docs/:file', (req, res) => {
  const file = req.params.file
  res.json(Yaml.load(`./api-docs/${file}`))
})

// Redirect to the swagger UI
app.use(
  '/api-products-docs',
  swaggerUi.serve,
  swaggerUi.setup(Yaml.load('./api-docs/products.yml'))
)
app.use(
  '/api-suppliers-docs',
  swaggerUi.serve,
  swaggerUi.setup(Yaml.load('./api-docs/suppliers.yml'))
)

// Serve the products
app.get('/products', (req, res) => {
  res.json({ items: products })
})

// Serve single product
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  res.json({ ...products.find((product) => product.id === id) })
})
// Serve the suppliers
app.get('/suppliers', (req, res) => {
  res.json({ items: suppliers })
})

// Serve a single supplier
app.get('/suppliers/:id', (req, res) => {
  const id = parseInt(req.params.id)
  res.json({ ...suppliers.find((supplier) => supplier.id === id) })
})
