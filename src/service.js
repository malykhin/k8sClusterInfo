const shell = require('shelljs')

const promisifyExec = (command) => {
  return new Promise( (resolve, reject) => {
    shell.exec(command, {silent: true}, (code, stdout, stderr) => {
      if (code > 0 || stderr) {
        reject(stderr)
      } else {
        resolve(stdout.split(' '))
      }
    })
  })
}

const getNamespacesNames = () => promisifyExec(`kubectl get namespaces -o=jsonpath='{$.items[:].metadata.name}'`)
const getNamespaceDeploymentsNames = (namespace) => promisifyExec(`kubectl get deployment --namespace=${namespace} -o=jsonpath='{$.items[:].metadata.name}'`)
const getNamespaceDeploymentsImages = (namespace) => promisifyExec(`kubectl get deployment --namespace=${namespace} -o=jsonpath='{$.items[:].spec.template.spec.containers[:1].image}'`)

const getClusterInfo = async () => {
  const namespaces = await getNamespacesNames()
  const result = {}

  for ( const namespace of namespaces) {
    const deployments = await getNamespaceDeploymentsNames(namespace)
    const images = (await getNamespaceDeploymentsImages(namespace))
      .map( image => image.replace(/^.+?:/, ''))

    result[namespace] = deployments.map((deployment, index) => {
      return {
        deployment,
        image: images[index]
      }
    })
  }
  return result
}

module.exports = {
  getClusterInfo
}
