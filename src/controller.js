const { getClusterInfo } = require('./service')
const config = require('../config')

async function render (req, res) {
  const clusterInfo = await getClusterInfo()
  const namespaces = Object.keys(clusterInfo)
    .filter(namespace => config.namespacesToIgnore.some( ignore => ignore !== namespace))

  const info = namespaces.map( namespace => clusterInfo[namespace])
  res.render('info', {namespaces, info})
}

module.exports = {
  render
}