const https = require('https')
const http = require('http')
const AWS = require('aws-sdk')

function request(opts) {
  let requestFn = http.request
  if (opts.constructor === String && opts.indexOf('https:') === 0
    || opts.protocol === 'https:') {
    requestFn = https.request
  }
  return new Promise((resolve, reject) => {
    let req = requestFn(
      opts,
      function (res) {
        let data = ''
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          data += chunk
        })
        res.on('end', function() {
          resolve(data)
        })
      }
    )
    req.on('socket', function (socket) {
      socket.setTimeout(opts.timeout || 3000);  
      socket.on('timeout', function() {
        req.abort();
      });
    })
    req.on('error', function(err) {
      resolve(err)
    })
    if (opts.body && (opts.body.constructor === Object || opts.body.constructor === Array)) {
      opts.body = JSON.stringify(opts.body)
    }
    req.write(opts.body || '');
    req.end()
  })
}

function putS3(bucket, key, data){
  var s3 = new AWS.S3();
  var params = {
    Bucket : bucket,
    Key : key,
    Body : JSON.stringify(data),
    ACL: 'public-read'
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function getS3(bucket, key) {
  var s3 = new AWS.S3();
  let params = {
    Bucket: bucket, 
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, function(err, data) {
      if (err) {
        reject(err)
        return err
      } else {
        let objectData = data.Body.toString('utf-8')
        try {
          objectData = JSON.parse(objectData)
        } catch (e) {
          reject(err)
        }
        resolve(objectData)
      }
    })
  })
}

module.exports = {
  request: request,
  putS3: putS3,
  getS3: getS3
}