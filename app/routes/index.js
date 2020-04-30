const localeRoutes = require('./locale_routes')
const projectRoutes = require('./project_routes')

module.exports = function (app, db) {
  localeRoutes(app, db)
  projectRoutes(app, db)
}
