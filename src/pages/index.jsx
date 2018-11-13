import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {AtTabBar, AtTabs, AtTabsPane} from 'taro-ui'

import Home from './home'
import Customer from './customer'
import User from './user'

import BaseView from '../components/BaseView'

import request from '../reducers/request'

import {getDeviceInfo, setState} from '../reducers/commonReducer'
import {postWxLogin, getDebugToken} from '../reducers/userReducer'

const testimage = require('../static/image/test.jpg')

const mapStateToProps = (state) => {
  return {commonReducer: state.commonReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    postWxLogin,
    getDebugToken,
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
  componentWillMount() {
    this.props.getDeviceInfo()
    Taro.login().then(res => {
      // this.props.postWxLogin({code: res.code})
    })
  }
  componentDidMount() {}
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
      <AtTabBar fixed={true} tabList={menuData} onClick={this.handleMenuClick.bind(this)} current={current}/>
    </BaseView>)
  }
}

export default Index
