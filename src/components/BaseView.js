import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {AtActivityIndicator} from 'taro-ui'

export default class extends Component {

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
    const {condition, className, basestyle} = this.props

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

    return (<View className={className
        ? `${className} baseview`
        : 'baseview'} style={basestyle}>
      {child}
    </View>)
  }
}