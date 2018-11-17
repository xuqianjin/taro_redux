import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {AtTabBar, AtTabs, AtTabsPane, AtModal} from 'taro-ui'

import Home from './home'
import Customer from './customer'
import User from './user'

import BaseView from '../components/BaseView'

import request from '../reducers/request'

import {getDeviceInfo, setState} from '../reducers/commonReducer'
import {postWxLogin, getDebugToken} from '../reducers/userReducer'

const testimage = require('../static/image/test.jpg')

import UploadFile from '../components/UploadFile'

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
      current: 0,
      showmodal: false
    }
  }
  componentWillReceiveProps(nextProps) {}
  componentWillMount() {
    this.props.getDeviceInfo()
    this.props.getDebugToken(1)
    Taro.login().then(res => {
      this.props.postWxLogin({code: res.code})
    })
  }
  componentDidMount() {}
  componentDidShow() {}

  componentDidHide() {}

  handleMenuClick = (current) => {
    this.setState({current})
  }
  handleModalConfirm = () => {
    Taro.navigateTo({url: '/pages/login/login'})
    this.setState({showmodal: false})
  }
  handleModalClose = () => {
    Taro.navigateTo({url: '/pages/login/login'})
    this.setState({showmodal: false})
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
    const {current, showmodal} = this.state
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
      <AtModal isOpened={showmodal} title='提示' confirmText='去授权' onClose={this.handleModalClose.bind(this)} onConfirm={this.handleModalConfirm.bind(this)} content='为了获得更好体验,我们需要您的微信授权点击去授权'></AtModal>
    </BaseView>)
  }
}

export default Index
