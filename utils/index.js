const { readFileSync } = require('fs')
const { mask } = require('ip')
const crypto = require('crypto')


const Utils = {
  loadConfig: () => {
    const config = {
      routes: [],
      local: {}
    }
    
    try {
      const savedConfig = JSON.parse(readFileSync('./config.json').toString())
    
      config.routes = savedConfig.routes || config.routes
      config.default = savedConfig.default
      config.local = savedConfig.local || config.local
    } catch (err) {
      console.log(err)
    }

    return config
  },

  extractFromPacket: (field, packet) => {
    switch (field) {
      case 'destination_ip':
          const [destinationIp, destinationPort] = packet.split('||')[2].split('\n')[1].split(':')
          return destinationIp || ''
        break
      case 'destination_port':
          const [destinationIp, destinationPort] = packet.split('||')[2].split('\n')[1].split(':')
          return destinationPort || ''
        break
      default:
    }
  },

  extractFromEthPacket: (field, packet) => {
    switch (field) {
      case 'destination_ip':
          const [originIp, originPort, destinationIp, destinationPort] = str.split('||')[1].split('|')
          return destinationIp || ''
        break
      case 'destination_port':
          const [originIp, originPort, destinationIp, destinationPort] = str.split('||')[1].split('|')
          return destinationPort || ''
        break
      default:
    }
  },

  isLocal: (originIp, originMask, destinationIp) => {
    return mask(originIp, originMask) === mask(destinationIp, originMask)
  },

  checksum: (str, algorithm, encoding) => {
    return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex')
  }
}

module.exports = Utils
