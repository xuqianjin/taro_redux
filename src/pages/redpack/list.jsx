import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  AtTabBar,
  AtTabs,
  AtTabsPane,
  AtLoadMore,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent
} from "taro-ui";

import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import {
  getRedPackSend,
  getRedPackReceive,
  getRedPackStatistic
} from "../../reducers/redpackReducer";
import RedpackCenter from "./RedpackCenter";
import ListItem from "./ListItem";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getRedPackSend, getRedPackReceive, getRedPackStatistic },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "红包记录",
    navigationBarBackgroundColor: "#d65c44",
    backgroundColor: "#d65c44",
    backgroundColorTop: "#d65c44"
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      chooseuser: 0,
      redpacklist: "",
      myhasMore: true
    };
    this.mypage = {
      pageNo: 0,
      pageSize: 10
    };
    this.usertag = [
      {
        name: "我发出的",
        func: this.props.getRedPackSend
      },
      {
        name: "我收到的",
        func: this.props.getRedPackReceive
      }
    ];
  }
  componentWillMount() {
    Taro.eventCenter.on("getUserRedpack", () => {
      this.props.getRedPackStatistic();
      this.setState({ redpacklist: "", chooseuser: 0, myhasMore: true }, () => {
        this.mypage.pageNo = 0;
        this.requestMyList();
      });
    });
    Taro.eventCenter.trigger("getUserRedpack");
  }
  componentWillUnmount() {
    Taro.eventCenter.off("getUserRedpack");
  }
  requestMyList = () => {
    const { chooseuser } = this.state;
    const { func } = this.usertag[chooseuser];
    if (!this.state.myhasMore) {
      return;
    }
    const params = Object.assign({}, this.mypage, {});
    func(params).then(({ value }) => {
      const { redpacklist } = this.state;
      this.setState({
        redpacklist: redpacklist ? redpacklist.concat(value) : value
      });
      if (value.length < this.mypage.pageSize) {
        this.setState({
          myhasMore: false
        });
      }
    });
  };
  handleUserClick = index => {
    const { chooseuser } = this.state;
    this.mypage.pageNo = 0;
    this.setState(
      { chooseuser: index, redpacklist: "", myhasMore: true },
      this.requestMyList
    );
  };
  handleItemClick = item => {
    Taro.navigateTo({
      url: `/pages/redpack/detail?redpackId=${item.redpackId || item.id}`
    });
  };
  handleTypeClick = item => {
    switch (item.value) {
      case 1:
        Taro.navigateTo({ url: `/pages/demo/uploadh?kind=${item.value}` });
        break;
      case 2:
        Taro.navigateTo({ url: `/pages/demo/uploadm?kind=${item.value}` });
        break;
      default:
    }
  };
  onMyScrollToLower = () => {
    this.mypage.pageNo++;
    this.requestMyList();
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { redpackstatistic } = this.props.redpackReducer;
    const { chooseuser, redpacklist, myhasMore } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const { moneyLeft, moneyReceive, moneySend, numReceive, numSend } =
      redpackstatistic || {};
    const title = `${chooseuser == 0 ? "共发出" : "共收到"}`;
    const { money, num } =
      chooseuser == 0
        ? { money: moneySend, num: numSend }
        : { money: moneyReceive, num: numReceive };

    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 550 - 20
    );

    return (
      <View className="content">
        <View className="header">
          <View className="attabs at-row">
            {this.usertag.map((tag, index) => {
              let color = index == chooseuser ? "choose" : "default";
              return (
                <View
                  className={`at-col text_center`}
                  key={tag.value}
                  onClick={this.handleUserClick.bind(this, index)}
                >
                  <Text className={`${color}`}>{tag.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <RedpackCenter avatarUrl={usercarte.avatarUrl} />
        <View className="body">
          <View className="infoblock">
            <View>
              <Text className="text_theme">{usercarte.name}</Text>
              {title}
            </View>
            <HeightView height={20} color="transparent" />
            <View className="at-row">
              <View className="at-col text_center">
                <View className="text_black_light">金额(元)</View>
                <HeightView height={20} color="transparent" />
                <View className="number">{money / 100}</View>
              </View>
              <View className="at-col text_center">
                <View className="text_black_light">数量(个)</View>
                <HeightView height={20} color="transparent" />
                <View className="number">{num}</View>
              </View>
            </View>
          </View>
          <ScrollView
            scrollY={true}
            style={`height:${scrollheight}`}
            onScrollToLower={this.onMyScrollToLower}
            className="body"
          >
            {redpacklist &&
              redpacklist.map((item, index) => {
                const avatarUrl =
                  chooseuser == 0 ? usercarte.avatarUrl : item.Sender.avatarUrl;
                const nickName =
                  chooseuser == 0 ? usercarte.name : item.Sender.nickName;
                const createdAt = item.createdAt;
                const itemmoney = item.money / 100 + "元";
                const desc =
                  chooseuser == 0 ? item.numTaken + "/" + item.amount : "";

                return (
                  <ListItem
                    key={item.id}
                    avatarUrl={avatarUrl}
                    nickName={nickName}
                    createdAt={moment(createdAt).format("MM月DD日 HH:mm")}
                    money={itemmoney}
                    desc={desc}
                    onClick={this.handleItemClick.bind(this, item)}
                  />
                );
              })}
            <AtLoadMore status={myhasMore ? "loading" : "noMore"} />
          </ScrollView>
        </View>
      </View>
    );
  }
}
