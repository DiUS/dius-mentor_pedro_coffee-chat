'use strict'
const ApiUtil = require('../util/ApiUtil').ApiUtil
const baseUrl = require('../config.js').baseUrl
const mimeJson = 'application/json'
const headers = { 'Content-Type': mimeJson, 'Accept': mimeJson }
var fetch = require('node-fetch');

const getRequest = (url) => fetch(url, { headers })
  .then(ApiUtil.checkStatus)
  .then(resp => resp.json())
const deleteRequest = (url) => fetch(url, { method:'DELETE', headers:headers })
  .then(ApiUtil.checkStatus)
  .then(resp => resp.json())
const postRequest = (url,body) => fetch(url, { method:'POST', headers:headers, body: body })
  .then(ApiUtil.checkStatus)
  .then(resp => resp.json())
const patchRequest = (url,body) => fetch(url, { method:'PATCH', headers:headers, body: body })
  .then(ApiUtil.checkStatus)
  .then(resp => resp.json())

const Client = (url = baseUrl) => ({
  // Order Requests
  listOrders: () => getRequest(`${url}/order`),
  getOrder: (id) => getRequest(`${url}/order/${id}`),
  createOrder: () => postRequest(`${url}/order`),
  deleteOrder: (id) => deleteRequest(`${url}/order/${id}`),
  updateOrder: (id, name) => patchRequest(`${url}/order/${id}`,
    JSON.stringify({name : name})),
  // Menu Requests
  getMenu: () => getRequest(`${url}/menu`),
  getDrinkMenu: (type) => getRequest(`${url}/menu/${type}`),
  // Drink Requests
  getDrink: (id,drink) => getRequest(`${url}/order/${id}/coffee/${drink.id}`),
  createDrink: (id,drink) => postRequest(`${url}/order/${id}/coffee`,
    JSON.stringify({style : drink.style,size : drink.size,})),
  updateDrink: (id,drink) => patchRequest(`${url}/order/${id}/coffee/${drink.id}`,
    JSON.stringify({style : drink.style, size : drink.size,})),
  deleteDrink: (id,drink) => deleteRequest(`${url}/order/${id}/coffee/${drink.id}`)
})

exports.Client = Client;
