import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Button } from "@tarojs/components";
import { AtList, AtListItem, AtIcon, AtBadge, AtAvatar } from "taro-ui";
import moment from "moment";
import { changeSrc } from "../lib/utils";

import HeightView from "../components/HeightView";
import "./style.scss";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    statistic: {},
    redpackstatistic: {}
  };
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  getUserList = () => {
    const { userinfodetail, statistic, redpackstatistic } = this.props;
    const { moneyLeft, numSend, numReceive } = redpackstatistic;
    const { vipEndAt } = userinfodetail || {};
    var unread = statistic.numUnreadMsgs;
    if (unread > 99) {
      unread = "99";
    }
    return [
      {
        icon: "money",
        title: "红包提现",
        extra: `余额:${moneyLeft / 100}元`,
        onClick: () => {
          Taro.navigateTo({ url: "/pages/redpack/money" });
        }
      },
      {
        icon: "list",
        title: "红包记录",
        extra: `已发送:${numSend}\t已领取:${numReceive}`,
        onClick: () => {
          Taro.navigateTo({ url: "/pages/redpack/list" });
        }
      },
      { type: "HeightView" },
      {
        icon: "message",
        title: "我的消息",
        extra: unread ? "你有新的消息" : "暂无消息",
        unread: unread ? unread : "",
        onClick: () => {
          Taro.navigateTo({ url: "/pages/message/index" });
        }
      },
      { type: "HeightView" },
      {
        icon: "sketch",
        title: "VIP会员",
        extra: vipEndAt
          ? `有效期到${moment(vipEndAt).format("YYYY-MM-DD")}`
          : "1天8毛钱",
        onClick: () => {
          Taro.navigateTo({ url: "/pages/vip/index" });
        }
      },
      {
        icon: "star",
        title: "收藏名片",
        extra: "收藏起来不丢失",
        onClick: () => {
          Taro.navigateTo({ url: "/pages/userinfo/collect" });
        }
      },
      {
        icon: "share",
        title: "邀请好友",
        extra: "享VIP折扣",
        onClick: () => {
          this.props.onShare && this.props.onShare();
        }
      },
      {
        icon: "phone",
        title: "联系我们",
        openType: "contact",
        onClick: () => {}
      }
    ];
  };
  handleUserData = () => {
    Taro.navigateTo({ url: "/pages/userinfo/edit" });
  };
  handleUserClick = index => {
    let list = this.getUserList();
    if (list[index].onClick) {
      list[index].onClick();
    }
  };
  render() {
    const { userinfodetail, usercarte } = this.props;
    const userCard = (
      <View
        onClick={this.handleUserData}
        className="at-row at-row__align--center bg_white userheader shadow opacity"
      >
        <View className="at-col at-col-1 at-col--auto">
          <AtAvatar
            className="userheadericon"
            circle={true}
            image={changeSrc(usercarte && usercarte.avatarUrl)}
          />
        </View>
        <View className="at-col">
          <View className="fontbig">{usercarte.name}</View>
          {usercarte.office && usercarte.corp && (
            <HeightView key={index} height={35} color="transparent" />
          )}
          {usercarte.office && usercarte.corp && (
            <View className="desc text_black_light">
              {usercarte.corp} | {usercarte.office}
            </View>
          )}
        </View>
        <View className="at-col at-col-1 at-col--auto right text_theme">
          <Text>编辑</Text>
          <AtIcon value="chevron-right" size="15" />
        </View>
      </View>
    );

    const buttonstyle =
      "border:0;line-height:1;font-size:16px;padding:0px;border-radius:0px";
    const list1data = this.getUserList();
    const list1 = list1data.map((item, index) => {
      return item.type == "HeightView" ? (
        <HeightView key={index} height={25} color="transparent" />
      ) : (
        <Button
          key={index}
          plain={true}
          style={buttonstyle}
          openType={item.openType}
          onClick={this.handleUserClick.bind(this, index)}
        >
          <View className="at-row user_list_item bg_white opacity">
            <View className="at-col at-col-1 at-col--auto icon">
              <AtIcon size={18} value={item.icon} className="text_theme" />
            </View>
            <View className="at-col at-col-1 at-col--auto">
              <View className="at-row">
                <View className="at-col at-col-1 at-col--auto  fontbig">
                  {item.title}
                </View>
                {item.unread && (
                  <View className="at-col at-col-1 at-col--auto badge">
                    {item.unread}
                  </View>
                )}
              </View>
            </View>
            <View className="at-col right text_black_light text_right">
              <Text>{item.extra}</Text>
              <AtIcon size={18} value="chevron-right" />
            </View>
          </View>
          <HeightView height={2} color="transparent" />
        </Button>
      );
    });
    return (
      <ScrollView scrollY={true}>
        <HeightView height={25} color="transparent" />
        {userCard}
        <HeightView height={25} color="transparent" />
        {list1}
        <HeightView height={150} color="transparent" />
      </ScrollView>
    );
  }
}
