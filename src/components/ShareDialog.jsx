import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtFloatLayout} from "taro-ui"

export default class extends Component {

  static defaultProps = {
    height: 1,
    color: APP_COLOR_GRAY
  }
  constructor(props) {
    super(props);
  }

  render() {
    const {height, color} = this.props
    const style = `height:${Taro.pxTransform(height)};background-color:${color}`
    return <AtFloatLayout title='选择分享位置'></AtFloatLayout>
  }
}