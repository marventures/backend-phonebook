const messages = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
};

/**
 * Generates an HTTP error with a specified status code and message.
 *
 * @param {number} status - The HTTP status code.
 * @param {string} [message] - The error message. If not provided, a default message corresponding to the status code will be used.
 * @returns {Error} An error object with the specified status code and message.
 */
const httpError = (status, message = messages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export { httpError };
