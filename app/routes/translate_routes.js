const ObjectID = require('mongodb').ObjectID
const sendRes = require('../constants/sendRes')
const sendErr = require('../constants/sendErr')
const { ERROR_CODES_MAP } = require('../constants/codes')

const updateAllLocales = ({
  req,
  res,
  collection,
  updateEveryLocale,
  sendResults,
}) => {
  const { projectId } = req.params

  const params = {
    id: { _id: new ObjectID(projectId) },
    query: {
      fields: {
        _id: 0,
        translations: 1,
      },
    },
  }
  collection.find(params.id, params.query).toArray((err, result) => {
    if (err) {
      sendErr({ res, err })
    } else {
      const locales = Object.keys(result[0].translations)

      const promises = locales.map(updateEveryLocale)
      const results = Promise.all(promises)
      sendResults({ results })
    }
  })
}

module.exports = function (app, collection) {
  app.get('/getTranslationsByLocale/:projectId/:locale', (req, res) => {
    const { projectId, locale } = req.params
    const key = `translations.${locale}`

    const params = {
      id: { _id: new ObjectID(projectId) },
      query: {
        fields: {
          _id: 0,
          [key]: 1,
        },
      },
    }

    collection.find(params.id, params.query).toArray((err, result) => {
      if (err) {
        sendErr({ res, err })
      } else {
        const translations = {
          [locale]: result[0].translations[locale] || {},
        }
        sendRes({ res, data: translations })
      }
    })
  })

  app.post('/addKeyTranslation/:projectId/', (req, res) => {
    const { projectId } = req.params
    const { keyTranslation } = req.body

    const updateEveryLocale = (locale) =>
      new Promise((resolve, reject) => {
        const key = `translations.${locale}.${keyTranslation}`

        const params = {
          filter: {
            _id: new ObjectID(projectId),
            [key]: { $exists: false },
          },
          update: { $set: { [key]: '' } },
          options: { returnOriginal: false },
        }
        collection
          .findOneAndUpdate(params.filter, params.update, params.options)
          .then((result) => resolve(result))
          .catch((err) => reject(err))
      })

    const sendResults = ({ results }) =>
      results
        .then((result) => {
          const { value } = result[0]
          if (value === null) {
            sendErr({ res, err: ERROR_CODES_MAP.duplicate_key })
          } else {
            sendRes({ res, data: { keyTranslation } })
          }
        })
        .catch((err) => sendErr({ res, err }))

    updateAllLocales({ res, req, collection, updateEveryLocale, sendResults })
  })

  app.delete('/deleteKeyTranslation/:projectId/:keyTranslation', (req, res) => {
    const { projectId, keyTranslation } = req.params

    const updateEveryLocale = (locale) =>
      new Promise((resolve, reject) => {
        const key = `translations.${locale}.${keyTranslation}`

        const params = {
          id: { _id: new ObjectID(projectId) },
          query: { $unset: { [key]: 1 } },
        }

        collection
          .update(params.id, params.query)
          .then((result) => resolve(result))
          .catch((err) => reject(err))
      })

    const sendResults = ({ results }) =>
      results
        .then((result) => sendRes({ res, data: result[0].result }))
        .catch((err) => sendErr({ res, err }))

    updateAllLocales({ res, req, collection, updateEveryLocale, sendResults })
  })

  app.post('/addTranslation/:projectId/:locale/:keyTranslation', (req, res) => {
    const { projectId, locale, keyTranslation } = req.params
    const { translation } = req.body

    if (typeof translation !== 'string') {
      sendErr({ res, err: ERROR_CODES_MAP.invalid_translation })
    } else {
      const key = `translations.${locale}.${keyTranslation}`

      const params = {
        filter: {
          _id: new ObjectID(projectId),
          [key]: { $exists: true },
        },
        update: { $set: { [key]: translation } },
        options: { returnOriginal: false },
      }
      collection
        .findOneAndUpdate(params.filter, params.update, params.options)
        .then((result) => {
          const { value } = result
          if (value === null) {
            sendErr({ res, err: ERROR_CODES_MAP.null })
          } else {
            sendRes({ res, data: value.translations[locale] })
          }
        })
        .catch((err) => sendErr({ res, err }))
    }
  })
}
