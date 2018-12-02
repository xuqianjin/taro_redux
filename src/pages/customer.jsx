import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Button, Text, Input, ScrollView } from "@tarojs/components";
import { AtTabBar, AtTabs, AtTabsPane, AtLoadMore } from "taro-ui";
import UserItem from "../components/UserItem";
import { putVisit, postFriendShip } from "../reducers/customerReducer";

const mapStateToProps = state => {
  return {
    customerReducer: state.customerReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putVisit,
      postFriendShip
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
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
  onItemClick = item => {
    const { Visitor, visitorId } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${visitorId}`
    });
  };
  onSetIntent = item => {
    const { id } = item;
    const postdata = {
      visitorData: {}
    };
    Taro.showLoading();
    this.props.putVisit(id, postdata).then(res => {
      Taro.hideLoading();
      Taro.eventCenter.trigger("getCustomer");
    });
  };
  render() {
    const { deviceinfo, visitguest, visitintent } = this.props;
    const tabList = [
      {
        title: "最近访客"
      },
      {
        title: "意向客户"
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
        swipeable={false}
      >
        <AtTabsPane current={this.state.current} index={1}>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            {visitguest &&
              visitguest.map(item => {
                return (
                  <UserItem
                    key={item.id}
                    item={item}
                    type={1}
                    onItemClick={this.onItemClick}
                    onSetIntent={this.onSetIntent}
                  />
                );
              })}
            <AtLoadMore status={"noMore"} />
          </ScrollView>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={0}>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            {visitintent &&
              visitintent.map(item => {
                return (
                  <UserItem
                    key={item.id}
                    item={item}
                    onItemClick={this.onItemClick}
                    onSetIntent={this.onSetIntent}
                  />
                );
              })}
            <AtLoadMore status={"noMore"} />
          </ScrollView>
        </AtTabsPane>
      </AtTabs>
    );
  }
}
