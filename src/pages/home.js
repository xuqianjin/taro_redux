import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'

import BaseView from '../components/BaseView'

import './style.scss'

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

    let condition = {
      state: 'viewLoading',
      tipsString: '加载中...'
    }
    return (<BaseView condition={condition}>
      <Text className='button'>home</Text>
    </BaseView>)
  }
}