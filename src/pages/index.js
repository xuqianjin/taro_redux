import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {AtTabBar, AtTabs, AtTabsPane} from 'taro-ui'

import Home from './home'
import Customer from './customer'
import User from './user'

import BaseView from '../components/BaseView'

import {add, minus, asyncAdd} from '../redux/counter'
import {getDeviceInfo, setState} from '../redux/commonReducer'
const testimage = require('../static/image/test.jpg')

const mapStateToProps = (state) => {
  return {commonReducer: state.commonReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    add,
    minus,
    asyncAdd,
    getDeviceInfo,
    setState
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)

class Index extends Component {

  config = {}

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  componentWillReceiveProps(nextProps) {}
  componentWillMount() {}
  componentDidMount() {
    this.props.getDeviceInfo()
  }
  componentDidShow() {}

  componentDidHide() {}

  handleMenuClick = (current) => {
    this.setState({current})
  }

  getMenuData = () => {
    return [
      {
        title: '首页',
        iconType: 'home'
      }, {
        title: '客户',
        iconType: 'message'
      }, {
        title: '我的',
        iconType: 'user'
      }
    ]
  }
  render() {

    const {deviceinfo} = this.props.commonReducer
    const {current} = this.state
    const menuData = this.getMenuData()

    let condition = false
    if (deviceinfo) {} else {
      condition = {
        state: 'viewLoading',
        tipsString: '加载中...'
      }
    }
    return (<BaseView condition={condition}>
      <AtTabs current={current}>
        <AtTabsPane current={current} index={0}>
          <Home ></Home>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <Customer></Customer>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <User></User>
        </AtTabsPane>
      </AtTabs>
      <View style='height:120rpx'></View>
      <AtTabBar fixed={true} tabList={menuData} onClick={this.handleMenuClick.bind(this)} current={current}/>
    </BaseView>)
  }
}

export default Index
