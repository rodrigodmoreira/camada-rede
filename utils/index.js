const { readFileSync } = require('fs')
const { mask, address } = require('ip')
const crypto = require('crypto')


const Utils = {
  loadConfig: () => {
    const config = {
      routes: [],
      local: {
        ip: address(),
        mask: '255.255.255.0'
      }
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
      case 'destination_ip': {
        const [destinationIp, destinationPort] = packet.split('||')[2].split('\n')[1].split(':')
        return destinationIp || ''
        break
      }
      case 'destination_port': {
        const [destinationIp, destinationPort] = packet.split('||')[2].split('\n')[1].split(':')
        return destinationPort || ''
        break
      }
      case 'origin_port': {
        const [somenthing, originPort, somenthing2] = packet.split('||')[1].split('|')
        return originPort
      }
      default:
    }
  },

  extractFromEthPacket: (field, packet) => {
    switch (field) {
      case 'origin_ip': {
        const [originIp, destinationIp, checksum] = packet.split('||')[1].split('|')
        return originIp || ''
        break
      }
      case 'destination_ip': {
        const [originIp, destinationIp, checksum] = packet.split('||')[1].split('|')
        return destinationIp || ''
        break
      }
      case 'final_destination_ip': {
        const [destinationIp, destinationPort] = packet.split('||')[4].split('\n')[1].split(':')
        return destinationIp || ''
        break
      }
      case 'checksum': {
        const [originIp, destinationIp, checksum] = packet.split('||')[1].split('|')
        return checksum || ''
        break
      }
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
