const { readFileSync, writeFileSync } = require('fs')
const { execSync } = require('child_process')

const { loadConfig, extractFromPacket, isLocal, checkSum } = require('utils')

/**
 * args
 *  first 2 - unused args
 *  from 2 until the end - packets paths to be sent
 */
const args = process.argv.slice(2,process.argv.length)
const config = loadConfig()

function sendNetworkPacket () {
  for (const path of args) {
    const packet = readFileSync(path).toString()

    const destinationIp = extractFromPacket('destination_ip', packet)
    const destinationPort = extractFromPacket('destination_port', packet)

    // decide next hop ip
    const nextHop = config.default

    if (!isLocal(config.local.ip, config.local.mask, destinationIp)) {
      nextHop = `${destinationIp}:${destinationPort}`
    } else {
      for (const route in config.routes) {
        if (config.routes[route].includes(destinationIp)) {
          nextHop = route
          break
        }
      }
    }

    // save packet file and call physical layer route
    saveAndSendPacket(packet, nextHop)
  }
}

function saveAndSendPacket (originalPacket, nextHop) {
  const nextHop = nextHop.split(':')
  const packetCheckSum = checkSum(originalPacket)
  let networkHeader = `||${local.ip}|${local.port}|${nextHop[0]}|${nextHop[1]}|${packetCheckSum}||`
  const finalPacket = `${networkHeader}${originalPacket}`

  writeFileSync('../pacotes/pdu_rede.txt', finalPacket)
  execSync('../camada-fisica/cliente/cliente_fisica.sh')
}

sendNetworkPacket()
