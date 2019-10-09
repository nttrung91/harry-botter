function throwBoomError(ctx, boomErr) {
  const err = [boomErr.output.statusCode, boomErr]
  // e.g. ctx.throw('401', 'Unauthorized')
  ctx.throw(...err)
}

// Cookies is in JSON format
// Example: { cookie1: 'value1', cookie2: 'value2 }
function setCookies(ctx, cookies) {
  for (let name in cookies) {
    ctx.cookies.set(name, cookies[name])
  }
}

module.exports = {
  throwBoomError,
  setCookies
}
