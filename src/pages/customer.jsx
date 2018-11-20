import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input, ScrollView } from "@tarojs/components";
import { AtTabBar, AtTabs, AtTabsPane } from "taro-ui";
import UserItem from "../components/UserItem";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    deviceinfo: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  handleChangeTab(value) {
    this.setState({ current: value });
  }
  render() {
    const { deviceinfo } = this.props;
    const tabList = [
      {
        title: "意向客户"
      },
      {
        title: "最近访客"
      }
    ];
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 205
    );

    return (
      <AtTabs
        current={this.state.current}
        tabList={tabList}
        onClick={this.handleChangeTab.bind(this)}
      >
        <AtTabsPane current={this.state.current} index={0}>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            <UserItem />
          </ScrollView>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
            <UserItem />
          </ScrollView>
        </AtTabsPane>
      </AtTabs>
    );
  }
}
