import Taro, {Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <View>
      <View>fsfs</View>
      <WebView src='https://mp.weixin.qq.com/s/pXErki3wrQXlnpqlhawxJg'></WebView>
    </View>
  }
}