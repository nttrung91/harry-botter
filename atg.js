const fetch = require('node-fetch')

// Fix "Unable to verify the first certificate"
// Source: https://stackoverflow.com/questions/37567148/unable-to-verify-the-first-certificate-in-node-js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function API({ domain = '' }) {
  function login({
    body: { email, password, rememberMe, storeId } = {},
    headers = {}
  }) {
    return fetch(
      `${domain}/api/rest/model/atg/userprofiling/ProfileActor/login`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          storeId
        })
      }
    )
  }

  function getOrders({ headers = {} }) {
    return fetch(
      `${domain}/api/rest/model/atg/userprofiling/ProfileActor/customOrderLookUp`,
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          pragma: 'no-cache',
          ...headers
        }
      }
    ).then(async res => {
      if ([200, 201].includes(res.status)) {
        const resJson = await res.json()
        return resJson
      }

      return Promise.reject(res)
    })
  }

  return {
    login,
    getOrders
  }
}

module.exports = API
