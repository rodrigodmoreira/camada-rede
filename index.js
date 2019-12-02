const { readFileSync } = require('fs')
const { loadConfig, extractFromPacket, isLocal,  } = require('utils')

function camadaRedes () {
  /**
   * args
   *  first 2 - unused
   *  from 2 until the end - packets paths to be sent
   */
  const args = process.argv.slice(2,process.argv.length)
  const config = loadConfig()


  for (const path of args) {
    const file = readFileSync(path).toString()

    const destinationIp = extractFromPacket('destinationIp', file)
    
    // decide next hop ip
    const nextHop = config.default
    if (isLocal(config.origin.ip, config.origin.mask, destinationIp)) {
      // save file and call physical layer direct
    } else {
      for (const route in config.routes) {
        if (config.routes[route].includes(destinationIp)) {
          nextHop = route
          break
        }
      }
    }

    // save file and call physical layer route
  }
}

camadaRedes()

function saveAndSendPacket () {
  
}