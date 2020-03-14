const settings = require('./settings.js')

interface ICliSettings {
  name: string
  title: string
  version: string
  https: boolean
  host: string
  port: number
  baseUrl: string
  assetsDir: string
  publicPath: string
  outputDir: string
  mockPort: number
  devServerPort: number
}

interface IAppSettings {
  title: string
  theme: string
  showSettings: boolean
  showTagsView: boolean
  fixedHeader: boolean
  errorLog: string[]
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

interface ISentryCliSettings {
  url: string
  org: string
  project: string
  token: string
  dsn: string
  release: string
}

export const cliSettings: ICliSettings = settings.cliSettings
export const appSettings: IAppSettings = settings.appSettings
export const sentryCliSettings: ISentryCliSettings = settings.sentryCliSettings

export default {
  cliSettings,
  appSettings,
  sentryCliSettings
}
