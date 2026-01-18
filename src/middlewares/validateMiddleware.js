const responseHandle = require('../helpers/responseHandle');

module.exports = (schema, source = 'body') => (req ,res, next) => {
   try {
    const data = req[source]
    req.body = schema.parse(data);
    next()
   } catch (error) {
     return responseHandle.handleError(res, error)
   }
}