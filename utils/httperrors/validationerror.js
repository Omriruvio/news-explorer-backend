const httpStatusCodes = require('../httpstatuscodes');

class ValidationError extends Error {
  constructor(message, statusCode = httpStatusCodes.BAD_REQUEST) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

module.exports = ValidationError;
