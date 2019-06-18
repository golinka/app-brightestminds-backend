const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response }) {
    switch (error.name) {
      case "ValidationException": {
        response.status(error.status).json({
          error
        });
        break;
      }
      case "UserNotFoundException": {
        response.status(404).json({
          error: {
            message: error.message,
            code: 404
          }
        });
        break;
      }
      default: {
        response.status(error.status).json({
          error: {
            message: error.message || "Something went wrong",
            code: error.status || 500
          }
        });
        break;
      }
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // eslint-disable-next-line
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
