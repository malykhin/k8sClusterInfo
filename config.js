const config = {
  development: {
    port: 8080,
    namespacesToIgnore: ['kube-system']
  },
  production: {
    port: 80,
    namespacesToIgnore: ['kube-system']
  }
}

module.exports = config[process.env.NODE_ENV || 'development']