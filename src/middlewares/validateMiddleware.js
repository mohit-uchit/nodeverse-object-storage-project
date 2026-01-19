const responseHandle = require('../helpers/responseHandle');

/**
 * Middleware: Request validation with Zod schema
 * Validates request data against a Zod schema and responds with errors if validation fails
 * Parses data from specified source (default: body) and validates it
 * 
 * @param {Object} schema - Zod validation schema
 * @param {string} [source='body'] - Source to validate ('body', 'query', 'params', etc.)
 * @returns {Function} Middleware function
 * @example
 * // Usage: router.post('/upload', validate(uploadSchema), controller)
 * // Validates req.body against uploadSchema before passing to controller
 */
module.exports = (schema, source = 'body') => (req ,res, next) => {
   try {
    const data = req[source]
    req.body = schema.parse(data);
    next()
   } catch (error) {
     return responseHandle.handleError(res, error)
   }
}