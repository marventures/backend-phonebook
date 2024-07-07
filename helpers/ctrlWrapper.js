/**
 * Wraps a controller function to handle errors and pass them to the next middleware.
 *
 * @param {Function} ctrl - The controller function to wrap.
 * @returns {Function} A wrapped controller function that handles errors and passes them to the next middleware.
 */
const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

export { ctrlWrapper };
