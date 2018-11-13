import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {AtTabBar, AtTabs, AtTabsPane} from 'taro-ui'

export default class extends Component {
  static options = {
    addGlobalClass: true
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
    const tabList = [
      {
        title: '意向客户'
      }, {
        title: '访客'
      }
    ]
    return (<AtTabs current={this.state.current} tabList={tabList} onClick={this.handleChangeTab.bind(this)}>
      <AtTabsPane current={this.state.current} index={0}>
        <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页一的内容</View>
      </AtTabsPane>
      <AtTabsPane current={this.state.current} index={1}>
        <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
      </AtTabsPane>
    </AtTabs>)
  }
}