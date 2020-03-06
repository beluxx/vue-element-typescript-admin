import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import elementVariables from '@/styles/element-variables.scss'
import settings from '@/settings'

const appSettings = settings.appSettings

export interface ISettingsState {
  theme: string
  fixedHeader: boolean
  showSettings: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

@Module({ dynamic: true, store, name: 'settings', namespaced: true })
class Settings extends VuexModule implements ISettingsState {
  public theme = elementVariables.theme
  public fixedHeader = appSettings.fixedHeader
  public showSettings = appSettings.showSettings
  public showTagsView = appSettings.showTagsView
  public showSidebarLogo = appSettings.showSidebarLogo
  public sidebarTextTheme = appSettings.sidebarTextTheme

  @Mutation
  private CHANGE_SETTING(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public ChangeSetting(payload: { key: string, value: any}) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Settings)
