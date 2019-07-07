import axios from 'axios'
import { Toast } from 'vant';

const instance = axios.create({
  baseURL: 'https://mixin-net-proxy.fox.one',
  timeout: 10000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

instance.interceptors.response.use(response => {
  const { data } = response.data
  if (data) {
    return Promise.resolve(data)
  } else {
    return Promise.reject(data)
  }
}, error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          Toast.fail('Not Exist')
          break
        default:
          Toast.fail('Request error')
      }
    }
})

async function request(options) {
  const res = await instance.request(options)
  return Promise.resolve(res)
}

function post(url, params = {}) {
  const options = {
    url: url,
    method: 'post',
    ...params
  }
  return request(options)
}

function get(url, params = {}) {
  const options = {
    url: url,
    methods: 'get',
    ...params
  }
  return request(options)
}

function rpc(nodeAddr, payload) {
  const parts = nodeAddr.split(':')
  const rpcPort = parseInt(parts[1]) + 1000
  const rpcAddr = `http://${parts[0]}:${rpcPort}`
  const resp = post('/proxy', {
    data: {
      url: rpcAddr,
      method: 'POST',
      body: JSON.stringify(payload)
    }
  })
  return resp
}

function info(nodeAddr) {
  return rpc(nodeAddr,{
    'method': 'getinfo',
    'params': []
  })
}

export default {
  post, get, rpc,
  info
}