import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {View} from '@tarojs/components'

import {getOssToken} from '../../reducers/commonReducer'

import uploadAliyun from './lib/uploadAliyun'

const mapStateToProps = (state) => {
  return {commonReducer: state.commonReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getOssToken
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)

export default class extends Component {

  static defaultProps = {}
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.getOssToken()
  }
  handleClick = async () => {
    const {osstoken} = this.props.commonReducer
    console.log(osstoken);
    // const aliyunFileKey = dir+filePath.replace('wxfile://', '');
    const files = await Taro.chooseImage({count: 1})
    console.log(files);
    const config = {
      aliyunServerURL: `http://${osstoken.bucket}.${osstoken.region}.aliyuncs.com`,
      accessid: osstoken.credentials.AccessKeyId,
      accesskey: osstoken.credentials.AccessKeySecret,
      aliyunFileKey: 'test.png',
      Expiration: osstoken.credentials.Expiration
    }
    console.log(config);
    uploadAliyun(config, files.tempFilePaths[0])
  }
  render() {
    return <View onClick={this.handleClick.bind(this)}>{this.props.children}</View>
  }
}