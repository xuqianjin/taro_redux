import Taro, {Component} from '@tarojs/taro'
import '@tarojs/async-await'
import {Provider} from '@tarojs/redux'
import configStore from './store'

import reducer from './reducers'
import Index from './pages/index'

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

import './app.scss'

const globalvalue = {
  color: "#6190e8"
}

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/userinfo/edit','pages/index', 'pages/login/login'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: APP_COLOR_THEME,
      navigationBarTitleText: '小多机器人',
      navigationBarTextStyle: 'white',
      backgroundColor: APP_COLOR_GRAY,
      backgroundColorTop: APP_COLOR_GRAY,
      enablePullDownRefresh: false
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return (<Provider store={store}>
      <Index/>
    </Provider>)
  }
}

Taro.render(<App/>, document.getElementById('app'))