// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")

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

// All products endpoint
app.get("/api/products", (req, res, next) => {
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