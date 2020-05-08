const { SUCCESS_CODES_MAP } = require('./codes')

module.exports = ({ res, data }) => {
  const resObj = { ...SUCCESS_CODES_MAP.success, data }
  res.send(resObj)
}
