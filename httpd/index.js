
const config = require('./config')
const util = require('./util')

async function rpcNode(node, payload) {
  let parts = node.host.split(':')
  let resp = await util.request({
    host:  parts[0],
    path: '/',
    port: parseInt(parts[1]) + 1000,
    method: 'POST',
    body: payload,
    timeout: 8000
  })
  try {
    let ret = JSON.parse(resp)
    if (ret.data) {
      return ret.data
    } else {
      return ret
    }
  } catch (e) {
    return {"failed": e.toString()}
  }

}

async function handleGetNodes() {
  // url = `https://raw.githubusercontent.com/MixinNetwork/mixin/master/config/nodes.json`
  let resp = await util.request({
    protocol: 'https:',
    host: 'raw.githubusercontent.com',
    path: '/MixinNetwork/mixin/master/config/nodes.json',
    headers: { 'User-Agent': 'Awesome-Octocat-App' },
    method: 'GET'
  })
  try {
    resp = JSON.parse(resp)
  } catch (e) {
    return []
  }
  let tpl = Object.assign(config.nodes, {})
  let nodes = resp
  for (var i = nodes.length; i--; ) {
    nodes[i].name = 'Anonymous'
    nodes[i].text = ''
    for (var j = tpl.length; j--; ) {
      if (tpl[j].signer === nodes[i].signer) {
        nodes[i].name = tpl[j].name
        nodes[i].text = tpl[j].text
        break;
      }
    }
  }
  // save to S3
  await util.putS3(config.bucket, config.nodesFile, { nodes: nodes, updatedAt: (new Date()).toUTCString() })
  return tpl
}

async function handleCheckNodes () {
  let resp = await util.getS3(config.bucket, config.nodesFile)
  let result = []
  for (var i = resp.nodes.length; i--; ) {
    let node = Object.assign(resp.nodes[i], {})
    try {
      let ret = await rpcNode(resp.nodes[i], {
        "method": "getinfo",
        "params": []
      })
      node.stat = { code: 0, data: ret}
      result.push(node)
    } catch (e) {
      node.stat = { code: 0, data: e.toString()}
      result.push(node)
    }
  }
  let putRet = await util.putS3(config.bucket, config.nodesStatFile, { nodes: result, updatedAt: (new Date()).toUTCString() })
  return putRet
}

async function handleListSnapshots (addr) {
  let ret = await rpcNode({ host: addr }, {
    "method": "listsnapshots",
    "params": [0, 10, true, true]
  })
  return ret
}

async function handleGetTopSnapshots(addr) {
  let info = await rpcNode({host: addr }, {
    "method": "getinfo", "params": []
  })
  let topology = info.graph.topology
  if (topology) {
    let topSnapshots = await rpcNode({host: addr}, {
      "method": "listsnapshots", "params": [topology - 10, 10, true, true]
    })
    return topSnapshots
  } else {
    return {code: 10002, data: "invalid topology"}
  }
}

exports.handler = async (event) => {
  console.log("request: " + JSON.stringify(event))
  let cmd = event
  if (event.body) {
    let body = JSON.parse(event.body)
    if (body.op) {
      cmd = body
    }
  }
  
  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key"
    },
    body: '{ "code": 0, "data": "ok"} '
  }

  switch (cmd.op) {
    case 'get-nodes':
      let nodeInfo = await handleGetNodes()
      response.body = JSON.stringify(nodeInfo)
      break
    case 'check-nodes':
      let status = await handleCheckNodes()
      response.body = JSON.stringify(status)
      break
    case 'list-snapshots':
      if (cmd.params && cmd.params.length) {
        let snapshots = await handleListSnapshots(cmd.params[0])
        response.body = JSON.stringify(snapshots)
      } else {
        response.body = JSON.stringify({code: 10001, data: "invalid params"})
      }
      break
    case 'get-topsnapshots':
      if (cmd.params && cmd.params.length) {
        let snapshots = await handleGetTopSnapshots(cmd.params[0])
        response.body = JSON.stringify(snapshots)
      } else {
        response.body = JSON.stringify({code: 10001, data: "invalid params"})
      }
      break
    default:
      break
  }
  return response
};
