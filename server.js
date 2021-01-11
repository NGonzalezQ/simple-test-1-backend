// Create express app
const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./database.js")

app.use(cors())

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
  let discountedPrice = ((price * 20) / 100)
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
  const sql = "select * from products where (brand || description) like ?"
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
  let sql = "select * from products"
  let params = []
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
  let sql = "select * from products where id = ?"
  let params = req.params.id
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

// Default response for any other request
app.use((req, res) => {
  res.status(404)
})