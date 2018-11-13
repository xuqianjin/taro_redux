import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import {AtButton} from 'taro-ui'
import HeightView from '../../components/HeightView'

export default class extends Component {

  static defaultProps = {}

  constructor(props) {
    super(props);
  }
  onGetPhoneNumber = (phone) => {
    console.log(phone);
  }
  onGetUserInfo = (user) => {
    console.log(user);
  }
  render() {
    const {height, color} = this.props
    const style = 'height:100%;display:flex;align-items:center;justify-content:center; flex-direction:column'
    return <View style={style}>
      <Text className='text_black_light'>使用微信账号快捷登录</Text>
      <HeightView height={100}></HeightView>
      <AtButton type='primary' openType='getUserInfo' onGetPhoneNumber={this.onGetPhoneNumber} onGetUserInfo={this.onGetUserInfo}>微信授权登录</AtButton>
    </View>
  }
}