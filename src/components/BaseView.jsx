import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {AtActivityIndicator} from 'taro-ui'

export default class extends Component {

  static externalClasses = ['baseclassname']

  static options = {
    addGlobalClass: true
  }
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  render() {
    const {condition, basestyle} = this.props

    let child = null
    if (condition && condition.state) {
      switch (condition.state) {
        case 'viewLoading':
          child = <AtActivityIndicator mode='center' content={condition.tipsString}/>
          break;
      }
    } else {
      child = this.props.children
    }

    //  小程序bug兼容 https://nervjs.github.io/taro/docs/component-style.html

    var className = 'baseclassname'
    if (process.env.TARO_ENV !== 'weapp') {
      className = this.props.baseclassname
    }

    return (<View className={className
        ? `${className} baseview`
        : 'baseview'} style={basestyle}>
      {child}
    </View>)
  }
}