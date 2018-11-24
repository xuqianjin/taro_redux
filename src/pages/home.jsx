import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input } from "@tarojs/components";

import { AtListItem, AtCurtain, AtButton } from "taro-ui";

import BaseView from "../components/BaseView";
import HeightView from "../components/HeightView";
import ImageView from "../components/ImageView";

import "./style.scss";
const userheader =
  "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    usercarte: {}
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
    const { usercarte } = this.props;
    return [
      {
        title: "我的名片",
        icon: require("../static/icon/usercard.png"),
        desc: "个人展示页面 让好友认识你",
        left: `访问 ${usercarte.numView}`,
        right: `收藏 ${usercarte.numCollect}`,
        tourl: "/pages/userinfo/index"
      },
      {
        title: "获客文章",
        icon: require("../static/icon/article.png"),
        desc: "最新最全行业观点",
        left: "转发 0",
        right: "阅读 0",
        tourl: "/pages/article/index"
      }
      // , {
      //   title: '获客案例',
      //   icon: require('../static/icon/haibao.png'),
      //   desc: '海量最新模板',
      //   left: '我的分享 0'
      // }
    ];
  };
  handleTopClick = value => {
    switch (value) {
      case 1:
        break;
      case 2:
        Taro.navigateTo({ url: "/pages/viewlog/index" });
        break;
      case 3:
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
            <View className="number">0</View>
            <View className="text_black_light">今日提醒</View>
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleTopClick.bind(this, 2)}
          >
            <View className="number">2</View>
            <View className="text_black_light">今日访客</View>
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleTopClick.bind(this, 3)}
          >
            <View className="number">1</View>
            <View className="text_black_light">今日消息</View>
          </View>
        </View>
        <View className="at-row footer text_theme">
          <View
            className="at-col text_center line opacity"
            onClick={this.handleShare}
          >
            邀请好友获VIP
          </View>
          <View
            className="at-col text_center opacity"
            onClick={this.handleJoin}
          >
            加入群聊
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
            <View className="title">{item.title}</View>
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
