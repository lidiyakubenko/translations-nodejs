const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const mongoConfig = require('./config/mongo')
const assert = require('assert')

const app = express()
const client = MongoClient(mongoConfig.url, { useUnifiedTopology: true })

app.use(bodyParser.json())

const port = 8000

client.connect((err) => {
  assert.equal(null, err)

  client
    .db(mongoConfig.dbName)
    .createCollection(mongoConfig.collections.projects, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            name: {
              bsonType: 'string',
              pattern: '^[a-zA-Z_]+$',
              description: 'must be a string',
            },
            translations: {
              bsonType: 'object',
            }
          },
        },
      },
    })

  const collection = client
    .db(mongoConfig.dbName)
    .collection(mongoConfig.collections.projects)

  require('./app/routes')(app, collection)

  app.listen(port, () => {
    console.log('We are live on ' + port)
  })
})
