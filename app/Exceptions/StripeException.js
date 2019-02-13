const { LogicalException } = require("@adonisjs/generic-exceptions");

class StripeException extends LogicalException {
  handle(error, { response }) {
    response.status(error.status).send(error.message);
  }
}

module.exports = StripeException;
