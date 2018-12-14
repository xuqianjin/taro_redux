import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input } from "@tarojs/components";

import { AtListItem, AtCurtain, AtButton, AtIcon } from "taro-ui";

import BaseView from "../components/BaseView";
import HeightView from "../components/HeightView";
import ImageView from "../components/ImageView";
import FormidButton from "../components/FormidButton";

import "./style.scss";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    userinfo: {},
    statistic: {}
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

  getListData = () => {
    const { userinfo, statistic } = this.props;
    return [
      {
        title: "我的名片",
        icon: require("../static/icon/usercard.png"),
        desc: "智能社交名片，全员微信营销",
        left: `访问 ${statistic.numCartesViewed}`,
        right: `收藏 ${statistic.numCartesCollected}`,
        tourl: `/pages/userinfo/index?userId=${userinfo.userId}`
      },
      {
        title: "获客文章",
        icon: require("../static/icon/article.png"),
        desc: "带名片专业文章，内容即客流",
        left: `转发 ${statistic.numArticlesForwarded}`,
        right: `阅读 ${statistic.numArticlesViewed}`,
        tourl: "/pages/article/index"
      },
      {
        title: "获客案例",
        icon: require("../static/icon/haibao.png"),
        desc: "海量最新模板",
        left: "我的分享 0",
        tourl: "/pages/demo/upload"
      }
    ];
  };
  handleTopClick = value => {
    switch (value) {
      case 1:
      case 2:
        Taro.navigateTo({ url: "/pages/viewlog/index" });
        break;
      case 3:
        Taro.navigateTo({ url: "/pages/message/index" });
        break;
      default:
    }
  };
  handleListClick = item => {
    Taro.navigateTo({ url: item.tourl });
  };
  handleShare = () => {
    this.props.onShare && this.props.onShare();
  };
  handleJoin = () => {
    const { onJoin } = this.props;
    onJoin();
  };
  render() {
    const { userinfo, statistic, numMsgsUnreadToday } = this.props;
    let condition = false;
    if (true) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const headeBg = <View className="bg_theme home_header_bg " />;

    const header = (
      <View className="home_header_container bg_white shadow">
        <View className="at-row header">
          <View
            className="at-col text_center opacity"
            onClick={this.handleTopClick.bind(this, 1)}
          >
            <View className="number">{statistic.numViewed}</View>
            <View className="text_black_light">历史访问</View>
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleTopClick.bind(this, 2)}
          >
            <View className="number">{statistic.numViewedToday}</View>
            <View className="text_black_light">今日访客</View>
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleTopClick.bind(this, 3)}
          >
            <View className="number">{statistic.numMsgsToday}</View>
            <View className="text_black_light">今日消息</View>
          </View>
        </View>
        <View className="at-row at-row__align--center footer text_theme">
          <View
            className="at-col text_center line opacity"
            onClick={this.handleShare}
          >
            <AtIcon value="share" size={16} />
            <Text>\t邀请好友获VIP</Text>
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleJoin}
          >
            <AtIcon value="message" size={18} />
            <Text>\t加入群聊</Text>
          </View>
        </View>
      </View>
    );

    const userCard = this.getListData().map((item, index) => {
      return (
        <View
          key={index}
          onClick={this.handleListClick.bind(this, item)}
          className="at-row bg_white home_card_container shadow opacity"
        >
          <View className="at-col at-col-1 at-col--auto">
            <ImageView baseclassname="icon" src={item.icon} />
          </View>
          <View className="at-col">
            <View className="title fontbig">{item.title}</View>
            <View className="desc text_black_light">{item.desc}</View>
            <View className="at-row text_black_light">
              <Text className="at-col">{item.left}</Text>
              <Text className="at-col">{item.right}</Text>
            </View>
          </View>
        </View>
      );
    });

    return (
      <BaseView condition={condition}>
        {headeBg}
        {header}
        {userCard}
        <HeightView height={20} color="transparent" />
      </BaseView>
    );
  }
}
