import '@/styles/element-variables.scss'
import '@/styles/element-icon.css'
import Vue from 'vue'
import ElementLocale from 'element-ui/lib/locale'
import { AppModule } from '@/store/modules/app'
import i18n from '@/lang'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  // @ts-ignore
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  // @ts-ignore
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  InfiniteScroll,
  PageHeader,
  // @ts-ignore
  CascaderPanel,
  Avatar,
  Drawer,
  Popconfirm,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui'

Vue.prototype.$ELEMENT = {
  size: AppModule.size
}
ElementLocale.i18n((key: string, value: string) => i18n.t(key, value))

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Spinner)
Vue.use(Badge)
Vue.use(Card)
Vue.use(Rate)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Carousel)
Vue.use(Scrollbar)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(ColorPicker)
Vue.use(Transfer)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Link)
Vue.use(Divider)
Vue.use(Image)
Vue.use(Calendar)
Vue.use(Backtop)
Vue.use(InfiniteScroll)
Vue.use(PageHeader)
Vue.use(CascaderPanel)
Vue.use(Avatar)
Vue.use(Drawer)
Vue.use(Popconfirm)

// TODO
// fix bug https://github.com/ElementUI/babel-plugin-component/issues/31
const _Loading = Loading
const { directive: loadingDirective, service: loadingService } = _Loading
const _MessageBox = MessageBox
const { alert, confirm, prompt } = _MessageBox

Vue.use(loadingDirective)

Vue.prototype.$loading = loadingService
Vue.prototype.$msgbox = _MessageBox
Vue.prototype.$alert = alert
Vue.prototype.$confirm = confirm
Vue.prototype.$prompt = prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
