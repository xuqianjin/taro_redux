import Taro, {Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <WebView src='https://mp.weixin.qq.com/s/MHQpzet1AZta11J9w-N_Jw'></WebView>
  }
}