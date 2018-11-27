import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {View, Text} from '@tarojs/components'

import {AtButton} from 'taro-ui'
import HeightView from '../../components/HeightView'
import ImageView from '../../components/ImageView'
import {putWxUserInfo, putUserCarte} from '../../reducers/userReducer'

const mapStateToProps = (state) => {
  return {userReducer: state.userReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    putWxUserInfo,
    putUserCarte
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {

  static defaultProps = {}

  constructor(props) {
    super(props);
  }
  onGetUserInfo = async (res) => {
    const {detail} = res
    const {encryptedData, iv, errMsg, userInfo} = detail
    if (errMsg === 'getUserInfo:ok') {
      const {avatarUrl, gender, nickName} = userInfo
      await this.props.putWxUserInfo({encryptedData, iv})
      await this.props.putUserCarte({avatarUrl, gender, name: nickName})
      Taro.eventCenter.trigger('getUserCarte')
      Taro.navigateBack()
    }
  }
  render() {
    const {height, color} = this.props
    const style = 'height:100%;display:flex;align-items:center;justify-content:center; flex-direction:column;background:white'
    return <View style={style}>
      <ImageView basestyle='height:100px;width:100px;' src={require('../../static/icon/wechat_friend.png')}></ImageView>
      <Text className='text_black_light'>使用微信账号快捷登录</Text>
      <HeightView height={50}></HeightView>
      <AtButton type='primary' openType='getUserInfo' onGetPhoneNumber={this.onGetPhoneNumber} onGetUserInfo={this.onGetUserInfo}>微信授权登录</AtButton>
    </View>
  }
}