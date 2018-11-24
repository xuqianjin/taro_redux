import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Image} from '@tarojs/components'
import {AtFloatLayout} from "taro-ui"

const img = require('../static/image/test.jpg')
export default class extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    share: {}
  }
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleClickCircle = () => {
    // Taro.previewImage({urls: ['http://djpub.oss-cn-shenzhen.aliyuncs.com/1800407422.jpg']})
    Taro.navigateTo({ url: "/pages/qrcode/index" });
    this.handleClose()
  }
  handleClickFriend = () => {
    this.handleClose()
  }
  handleClose = () => {
    this.props.onClose && this.props.onClose()
  }
  render() {
    const {isOpened} = this.props
    const width = Taro.pxTransform(100)
    const imgstyle = `width:${width};height:${width}`
    const buttonstyle = 'border:0;line-height:1;font-size:16px;'
    return <AtFloatLayout isOpened={isOpened} title='选择分享位置' onClose={this.handleClose}>
      <View className='at-row'>
        <Button open-type='share' style={buttonstyle} className='at-col' plain={true} onClick={this.handleClickFriend}>
          <Image style={imgstyle} src={require('../static/icon/wechat_friend.png')}></Image>
          <View>分享好友</View>
        </Button>
        <Button style={buttonstyle} className='at-col' plain={true} onClick={this.handleClickCircle}>
          <Image style={imgstyle} src={require('../static/icon/wechat_circle.png')}></Image>
          <View>分享朋友圈</View>
        </Button>
      </View>
    </AtFloatLayout>
  }
}