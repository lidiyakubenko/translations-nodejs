const ObjectID = require('mongodb').ObjectID
const sendRes = require('../constants/sendRes')
const sendErr = require('../constants/sendErr')

module.exports = function (app, collection) {
  app.post('/addProject', (req, res) => {
    const { name } = req.body

    collection
      .insertOne({ name })
      .then((result) => sendRes({ res, data: result.ops[0] }))
      .catch((err) => sendErr({ res, err }))
  })

  app.delete('/deleteProject/:projectId', (req, res) => {
    const { projectId } = req.params

    collection
      .deleteOne({ _id: new ObjectID(projectId) })
      .then(() => sendRes({ res, data: {} }))
      .catch((err) => sendErr({ res, err }))
  })

  app.get('/getProject/:projectId', (req, res) => {
    const { projectId } = req.params

    collection.findOne({ _id: new ObjectID(projectId) }, (err, result) => {
      if (err || result === null) {
        sendErr({ res, err: err ? err : { code: 'null' } })
      } else {
        sendRes({ res, data: result })
      }
    })
  })
}
