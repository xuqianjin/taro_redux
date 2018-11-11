import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'

export default class extends Component {
  static options = {
    addGlobalClass: true
  }
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
    return (<View className='fullheight greencolor'>customer</View>)
  }
}