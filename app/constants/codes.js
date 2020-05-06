const SUCCESS_CODES_MAP = {
  success: {
    code: 'success',
  },
}

const ERROR_CODES_MAP = {
  duplicate_key: {
    code: 'duplicate_key',
    message: 'такой ключ уже существует',
  },
  duplicate_locale: {
    code: 'duplicate_locale',
    message: 'такая локаль уже существует',
  },
  invalid_translation: {
    code: 'invalid_translation',
    message: 'only string',
  },
  invalid_locale: {
    code: 'invalid_locale',
    message: 'локаль может быть только строкой из 2 букв',
  },
  null: {
    code: 'no_result',
    message: 'такого ключа не существует',
  },
  121: {
    code: 'failed_validation',
    message: 'имя может содержать только буквы и _',
  },
  11000: {
    code: 'duplicate',
    message: 'такое имя уже есть',
  },
}

module.exports = { SUCCESS_CODES_MAP, ERROR_CODES_MAP }
