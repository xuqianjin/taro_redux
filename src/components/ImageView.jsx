import Taro, {Component} from '@tarojs/taro'
import {Image} from '@tarojs/components'

export const changeSrc = (src) => {
  if (src && typeof src === 'string') {
    if (src.indexOf('http') !== 0) {
      src = CDN_URL + (
        src.indexOf('/') === 0
        ? ''
        : '/') + src;
    }
  }
  return src
};

export default class extends Component {

  static externalClasses = ['baseclassname']

  constructor(props) {
    super(props);
    this.state = {
      src: changeSrc(props.src)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.state.src = changeSrc(nextProps.src);
    }
  }

  onLoad = () => {
    // this.setState({
    //   src: changeSrc(require('../static/image/noPicture.png'))
    // })
  };
  onError = () => {
    this.setState({src: require('../static/image/noPicture.png')})
  };

  render() {
    const {src} = this.state
    let {basestyle, mode} = this.props

    //  小程序bug兼容 https://nervjs.github.io/taro/docs/component-style.html

    var className = 'baseclassname'
    if (process.env.TARO_ENV !== 'weapp') {
      className = this.props.baseclassname
    }

    return <Image src={src} onLoad={this.onLoad} onError={this.onError} className={className} style={basestyle} mode={mode}></Image>
  }
}