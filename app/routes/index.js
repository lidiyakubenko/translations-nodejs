const localeRoutes = require('./locale_routes')
const projectRoutes = require('./project_routes')
const translateRoutes = require('./translate_routes')

module.exports = function (app, db) {
  localeRoutes(app, db)
  projectRoutes(app, db)
  translateRoutes(app, db)
}
