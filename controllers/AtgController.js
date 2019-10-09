const Boom = require('boom')
const _get = require('lodash/get')

const Atg = require('../atg')
const Utils = require('../utils')
const paths = require('../paths')

const atg = new Atg({
  domain: paths.atg
})

const ORDER_STATUS_MAPPER = {
  SENT_TO_STORE: 'processing',
  PACK_COMPLETE: 'ready to deliver',
  ORDER_DELIVERED: 'delivered',
  ORDER_CANCELLED: 'cancelled',
  SENT_TO_FULFILLMENT: 'processing'
}

const normalizeOrders = orders =>
  orders.map(order => ({
    id: order.id,
    date: order.submittedDate.formattedDate,
    state: order.state,
    status: ORDER_STATUS_MAPPER[order.state]
  }))

module.exports = {
  async login(ctx) {
    try {
      const res = await atg.login({
        body: ctx.request.body
      })

      // Set new cookies using login response cookies
      const rawCookies = res.headers.raw()['set-cookie']
      const cookies = Utils.rawCookiesToJson(rawCookies)
      ctx.setCookies(ctx, cookies)

      const newRes = await res.json()
      if (newRes.errorCode) {
        return Promise.reject(newRes)
      }

      ctx.body = newRes
    } catch (err) {
      return ctx.throwBoomError(ctx, Boom.unauthorized())
    }
  },
  async getRecentOrder(ctx) {
    try {
      const res2 = await atg.getOrders({
        headers: {
          cookie: ctx.headers.cookie
        }
      })

      const orders = _get(res2, 'orderMap', [])

      if (!orders.length) {
        return (ctx.body = 'No order found.')
      }

      const normalizedOrders = normalizeOrders(orders)
      ctx.body = normalizedOrders[0]
    } catch (err) {
      if (err.status === 401) {
        return ctx.throwBoomError(ctx, Boom.unauthorized())
      }

      ctx.throwBoomError(ctx, Boom.internal())
    }
  }
}
