import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input, ScrollView} from '@tarojs/components'
import {AtTabBar, AtTabs, AtTabsPane} from 'taro-ui'

export default class extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    deviceinfo: {}
  }
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  handleChangeTab(value) {
    this.setState({current: value})
  }
  render() {
    const {deviceinfo} = this.props
    const tabList = [
      {
        title: '意向客户'
      }, {
        title: '访客'
      }
    ]
    const scrollheight = Taro.pxTransform(deviceinfo.windowHeight * 750 / deviceinfo.windowWidth - 160)

    return (<AtTabs current={this.state.current} tabList={tabList} onClick={this.handleChangeTab.bind(this)}>
      <AtTabsPane current={this.state.current} index={0}>
        <ScrollView scrollY={true} style={`height:${scrollheight}`}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页一的内容</View>
        </ScrollView>
      </AtTabsPane>
      <AtTabsPane current={this.state.current} index={1}>
        <ScrollView scrollY={true} style={`height:${scrollheight}`}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
        </ScrollView>
      </AtTabsPane>
    </AtTabs>)
  }
}