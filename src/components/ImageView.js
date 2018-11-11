import Taro, {Component} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import {isEqual} from "lodash";

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

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true;
    }
    return false;
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
    const {className, basestyle, mode} = this.props

    return <Image src={src} onLoad={this.onLoad} onError={this.onError} className='baseclassname' style={basestyle} mode={mode}></Image>
  }
}