const asyncHelper = fn =>
function asyncWrap(req, res, next, ...args) {
  const fnReturn = fn(req, res, next, ...args)
  return Promise.resolve(fnReturn).catch(next)
}

module.exports = asyncHelper;