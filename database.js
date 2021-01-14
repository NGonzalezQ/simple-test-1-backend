let sqlite3 = require('sqlite3').verbose()
const dbObject = require("./exampleData")

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log("Connected to the SQLite database")
    db.run(`CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      brand TEXT,
      image TEXT,
      description TEXT,
      price INTEGER
    )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          let insert = 'INSERT INTO products (id, name, brand, image, description, price) VALUES (?, ?, ?, ?, ?, ?)'
          dbObject.objects.forEach((object) => {
            db.run(insert, object)
          })
        }
      })
  }
})

module.exports = db