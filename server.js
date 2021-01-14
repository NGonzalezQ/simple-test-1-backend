// Create express app
const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./database.js")
const bodyParser = require("body-parser")
const dbObject = require("./exampleData")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server port
const PORT = process.env.PORT || 8000

// Function that checks if the string inserted is a palindrome
const isPalindrome = (str) => {
  return (
    str.replace(/[\W_]/g, '').toLowerCase() ===
    str.replace(/[\W_]/g, '').toLowerCase().split('').reverse().join('')
  )
}

// Function to reduce the price of a product by 20%
const discountPrice = (price) => {
  const discountedPrice = ((price * 20) / 100)
  return price - discountedPrice
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "OK" })
})

// Product by text search
app.get("/api/products", (req, res, next) => {
  const sql = "SELECT * FROM products WHERE (brand || description) LIKE ?"
  const params = '%' + [req.query.search] + '%'
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }

    if (params.length < 6) {
      res.status(400).json({ "error": "Search must be at least 3 characters long" })
      return
    } else if (rows.length < 1) {
      res.status(400).json({ "error": "No results found" })
      return
    } else {
      if (isPalindrome(params) === true) {
        rows.forEach(element => element.price = discountPrice(element.price))
      }

      res.json({
        "message": "success",
        "data": rows
      })
    }
  })
})

// All products endpoint
app.get("/api/products/all", (req, res, next) => {
  const sql = "SELECT * FROM products"
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }

    res.json({
      "message": "success",
      "data": rows
    })
  })
})

// Product by id endpoint
app.get("/api/products/:id", (req, res, next) => {
  const sql = "SELECT * FROM products WHERE id = ?"
  const params = req.params.id
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }

    if (row) {
      if (isPalindrome(params) === true && row) {
        row.price = discountPrice(row.price)
      }

      res.json({
        "message": "success",
        "data": row
      })
    } else {
      res.status(400).json({ "error": "Product ID not found" })
    }
  })
})

// Create new product
app.post("/api/products/add", (req, res, next) => {
  const errors = []
  if (!req.body.name) {
    errors.push("No name specified")
  }

  if (!req.body.brand) {
    errors.push("No brand specified")
  }

  if (!req.body.description) {
    errors.push("No description specified")
  }

  if (!req.body.price) {
    errors.push("No price specified")
  }

  const data = {
    name: req.body.name,
    brand: req.body.brand,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price
  }
  const sql = 'INSERT INTO products (name, brand, image, description, price) VALUES (?, ?, ?, ?, ?)'
  const params = [data.name, data.brand, data.image, data.description, data.price]

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
    }

    res.json({
      "message": "success",
      "data": data,
      "id": this.lastID
    })
  })
})

// Update a product
app.patch("/api/products/:id", (req, res, next) => {
  const data = {
    name: req.body.name,
    brand: req.body.brand,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price
  }

  const sql = `UPDATE products set
    name = COALESCE(?,name),
    brand = COALESCE(?,brand),
    image = COALESCE(?,image),
    description = COALESCE(?,description),
    price = COALESCE(?,price)
    WHERE id = ?`

  const params = [
    data.name,
    data.brand,
    data.image,
    data.description,
    data.price,
    req.params.id
  ]

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message })
      return
    }

    res.json({
      message: "success",
      data: data,
      changes: this.changes
    })
  })
})

// Delete a product
app.delete("/api/products/:id", (req, res, next) => {
  const sql = "DELETE FROM products where id = ?"
  const params = req.params.id

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message })
      return
    }

    res.json({
      "message": "deleted",
      changes: this.changes
    })
  })
})

// Default response for any other request
app.use((req, res) => {
  res.status(404)
})