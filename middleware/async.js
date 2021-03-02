const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;

// This handler replaces the try / catch blocks
