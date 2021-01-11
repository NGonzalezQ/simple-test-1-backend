let sqlite3 = require('sqlite3').verbose()
let md5 = require('md5')
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
      id INTEGER PRIMARY KEY,
      name text,
      brand text,
      image BLOB,
      description text,
      price INTEGER
    )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          let insert = 'INSERT INTO products (id, name, brand, image, description, price) VALUES (?, ?, ?, ?, ?, ?)'
          db.run(insert, dbObject.object1)
          db.run(insert, dbObject.object2)
          db.run(insert, dbObject.object3)
          db.run(insert, dbObject.object4)
          db.run(insert, dbObject.object5)
          db.run(insert, dbObject.object6)
          db.run(insert, dbObject.object7)
          db.run(insert, dbObject.object8)
          db.run(insert, dbObject.object9)
          db.run(insert, dbObject.object10)
          db.run(insert, dbObject.object11)
        }
      })
  }
})

module.exports = db