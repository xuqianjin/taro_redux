import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView } from "@tarojs/components";
import { AtList, AtListItem, AtIcon, AtBadge } from "taro-ui";
import moment from "moment";

import ImageView from "../components/ImageView";
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
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  getUserList = () => {
    const { userinfodetail, sessions } = this.props;
    const { vipEndAt } = userinfodetail || {};
    var unread = 0;
    if (sessions) {
      for (var session of sessions) {
        unread += session.unread;
      }
    }
    if (unread > 99) {
      unread = "99";
    }
    return [
      {
        icon: "message",
        title: "我的消息",
        extra: unread ? "你有新的消息" : "暂无消息",
        unread: unread ? unread : "",
        onClick: () => {
          Taro.navigateTo({ url: "/pages/message/index" });
        }
      },
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
        icon: "share",
        title: "邀请好友",
        extra: "享VIP折扣",
        onClick: () => {
          this.props.onShare && this.props.onShare();
        }
      }
      // {
      //   icon: "help",
      //   title: "使用攻略",
      //   extra: "玩转小多",
      //   onClick: () => {
      //     Taro.navigateTo({ url: "/pages/share/index?type=1&id=41" });
      //   }
      // }
    ];
  };
  getSysList = () => {
    return [
      {
        icon: "phone",
        title: "联系我们",
        onClick: () => {
          this.props.onJoin && this.props.onJoin();
        }
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
  handleSysClick = index => {
    let list = this.getSysList();
    if (list[index].onClick) {
      list[index].onClick();
    }
  };
  render() {
    const { userinfodetail } = this.props;
    const userCard = (
      <View
        onClick={this.handleUserData}
        className="at-row bg_white home_card_container shadow opacity"
      >
        <View className="at-col at-col-1 at-col--auto">
          <ImageView baseclassname="icon" src={userinfodetail.avatarUrl} />
        </View>
        <View className="at-col">
          <View className="title">{userinfodetail.nickName}</View>
          {userinfodetail.office && userinfodetail.corp && (
            <View className="desc text_black_light">
              {userinfodetail.office}| {userinfodetail.corp}
            </View>
          )}
        </View>
        <View className="at-col at-col-1 at-col--auto right text_theme">
          <Text>编辑</Text>
          <AtIcon value="chevron-right" size="15" />
        </View>
      </View>
    );

    const list1data = this.getUserList();
    const list1 = list1data.map((item, index) => {
      return (
        <View key={index} onClick={this.handleUserClick.bind(this, index)}>
          <View className="at-row user_list_item bg_white opacity">
            <View className="at-col at-col-1 at-col--auto icon">
              <AtIcon size={18} value={item.icon} className="text_theme" />
            </View>
            <View className="at-col at-col-1 at-col--auto">
              <View className="at-row">
                <View className="at-col at-col-1 at-col--auto title">
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
          {index < list1data.length - 1 && (
            <HeightView height={2} color="transparent" />
          )}
        </View>
      );
    });
    const list2data = this.getSysList();
    const list2 = list2data.map((item, index) => {
      return (
        <View key={index} onClick={this.handleSysClick.bind(this, index)}>
          <View className="at-row user_list_item bg_white opacity">
            <View className="at-col at-col-1 at-col--auto icon">
              <AtIcon size={18} value={item.icon} className="text_theme" />
            </View>
            <View className="at-col at-col-1 at-col--auto">
              <View className="title">{item.title}</View>
            </View>
            <View className="at-col right text_black_light text_right">
              <Text>{item.extra}</Text>
              <AtIcon size={18} value="chevron-right" />
            </View>
          </View>
          {index < list1data.length - 1 && (
            <HeightView height={2} color="transparent" />
          )}
        </View>
      );
    });
    return (
      <ScrollView scrollY={true}>
        <HeightView height={20} color="transparent" />
        {userCard}
        <HeightView height={80} color="transparent" />
        {list1}
        <HeightView height={50} color="transparent" />
        {list2}
      </ScrollView>
    );
  }
}
