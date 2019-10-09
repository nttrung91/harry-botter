const rawCookiesToJson = rawCookies => {
  function transformToJson(prev, curr) {
    try {
      const raw = curr.split(';')[0]
      const cookie = raw.split('=')
      const name = cookie[0]
      const value = cookie[1]

      return {
        ...prev,
        [name]: value
      }
    } catch (err) {
      return prev
    }
  }

  const json = rawCookies.reduce(transformToJson, {})
  return json
}

module.exports = {
  rawCookiesToJson
}
