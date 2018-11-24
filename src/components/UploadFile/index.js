import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'

import {View} from '@tarojs/components'
import {AtMessage} from 'taro-ui'

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

  static defaultProps = {
    config: {
      count: 1
    }
  }
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.getOssToken()
  }
  getfilename = (filepath) => {
    const dir = 'i/'
    let name = ''
    if (filepath && filepath.indexOf('/') > -1) {
      var split = filepath.split('/')
      name = split[split.length - 1]
    }
    return dir + name
  }

  handleClick = () => {
    const {osstoken} = this.props.commonReducer
    Taro.chooseImage(this.props.config).then(res => {
      Taro.showLoading({title: '上传图片中...', mask: true})
      const {tempFilePaths} = res
      var config = {
        aliyunServerURL: CDN_URL,
        accessid: osstoken.credentials.AccessKeyId,
        accesskey: osstoken.credentials.AccessKeySecret,
        Expiration: osstoken.credentials.Expiration,
        ststoken: osstoken.credentials.SecurityToken
      }
      console.log(config);
      var promissarray = []
      tempFilePaths.map(filepath => {
        const filename = this.getfilename(filepath)
        if (filename) {
          config.aliyunFileKey = filename
          promissarray.push(uploadAliyun(config, filepath))
        }
      })
      Promise.all(promissarray).then(res => {
        let fail = res.filter(result => result.statusCode !== 200)
        Taro.hideLoading()
        if (fail.length > 0) {
          Taro.atMessage({'message': `有${fail.length}张图片上传失败`, 'type': 'error'})
        } else {
          Taro.atMessage({'message': `图片上传成功`, 'type': 'success'})
          let success = res.map(result => {
            return result.path
          })
          this.props.onUpload && this.props.onUpload(success)
        }
      }).catch(err => {
        Taro.hideLoading()
        Taro.atMessage({'message': `图片上传失败${err.errMsg}`, 'type': 'error'})
        console.log(err)
      })
    }).catch(err => {
      console.log(err);
    })
  }
  render() {
    return <View onClick={this.handleClick.bind(this)}>
      <AtMessage></AtMessage>
      {this.props.children}
    </View>
  }
}