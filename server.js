// Create express app
const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./database.js")

app.use(cors())

// Server port
const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`)
})

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "OK" })
})

// Product by text search
app.get("/api/products", (req, res, next) => {
  const sql1 = "select * from products where (brand || name || description) like ?"
  const params = '%' + [req.query.search] + '%'
  db.all(sql1, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }
    if (params === "%panta%") {
      rows.forEach(element => element.price = (element.price - 20))
    }
    res.json({
      "message": "success",
      "data": rows
    })
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
  let params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message })
      return
    }
    res.json({
      "message": "success",
      "data": row
    })
  })
})

// Default response for any other request
app.use((req, res) => {
  res.status(404)
})