const axios = require('axios')

exports.handler = function(_, __, callback) {
  axios({
    method: 'POST',
    url:
      'https://universal-ecommerce-bot.herokuapp.com/api/checkout/initiate-checkout',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      email: 'trung0000@gmail.com',
      password: 'abcd1234',
      rememberMe: true,
      storeId: '0000009999'
    }
  })
    .then(res => {
      const cookies = res.headers['set-cookie']

      callback(null, {
        actions: [
          {
            remember: {
              cookies
            }
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/validate-cart'
          }
        ]
      })
    })
    .catch(error => {
      callback(null, {
        actions: [
          {
            say: 'Failed to login, please try again'
          },
          {
            redirect: 'https://glaucous-lapwing-1943.twil.io/fallback'
          }
        ]
      })
    })
}
