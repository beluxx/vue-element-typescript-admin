import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { setLanguage } from '@/utils/cookies'
import { getLocale } from '@/lang'
import store from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
  documentClientHeight: number
  documentClientWidth: number
}

@Module({ dynamic: true, store, name: 'app', namespaced: true })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: true,
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public language = getLocale()
  public size = 'medium'
  public documentClientHeight = 800
  public documentClientWidth = 1000

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
  }

  @Mutation
  private SET_CLIENT_WIDTH(width: number) {
    this.documentClientWidth = width
  }

  @Mutation
  private SET_CLIENT_HEIGHT(height: number) {
    this.documentClientHeight = height
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }

  @Action
  public SetClientWidth(width: number) {
    this.SET_CLIENT_WIDTH(width)
  }

  @Action
  public SetClientHeight(height: number) {
    this.SET_CLIENT_HEIGHT(height)
  }
}

export const AppModule = getModule(App)
