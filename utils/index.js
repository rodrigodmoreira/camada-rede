const { readFileSync } = require('fs')
const { mask } = require('ip')

const Utils = {
  loadConfig: () => {
    const config = {
      routes: [],
      origin: {}
    }
    
    try {
      const savedConfig = JSON.parse(readFileSync('./config.json').toString())
    
      config.routes = savedConfig.routes || config.routes
      config.default = savedConfig.default
      config.origin = savedConfig.origin || config.origin
    } catch (err) {
      console.log(err)
    }

    return config
  },

  extractFromPacket: (field, packet) => {
    return '0.0.0.0:0'
  },

  isLocal: (originIp, originMask, destinationIp) => {
    return mask(originIp, originMask) === mask(destinationIp, originMask)
  }
}

module.exports = Utils
