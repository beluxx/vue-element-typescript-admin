const settings = require('@/config/settings')

module.exports = {
  name: settings.cliSettings.name,
  includeVersion: settings.cliSettings.version,
  inputFiles: ['./src'],
  mode: 'modules',
  out: 'docs',
  includeDeclarations: true,
  exclude: './src/icons/**/*.ts',
  excludeExternals: true,
  hideGenerator: true
}
