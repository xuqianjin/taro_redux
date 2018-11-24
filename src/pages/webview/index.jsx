import Taro, {Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <View>
      <View>fsfs</View>
      <WebView src='http://djpub.oss-cn-shenzhen.aliyuncs.com/a/8.html'></WebView>
    </View>
  }
}