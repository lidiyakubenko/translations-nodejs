const { ERROR_CODES_MAP } = require('./codes')

module.exports = ({ res, err }) => {
  const errorObj = ERROR_CODES_MAP[err.code] || err
  res.status(500).send(errorObj)
}
