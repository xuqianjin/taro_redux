import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, ScrollView } from "@tarojs/components";
import moment from "moment";

import {
  AtForm,
  AtButton,
  AtInput,
  AtCurtain,
  AtIcon,
  AtMessage
} from "taro-ui";

import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";

import chatItem from "./chatItem";
import { postWxForcepush } from "../../reducers/userReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ postWxForcepush }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      messages: [],
      scrollIntoView: "",
      showcurtain: false,
      presession: "",
      params: {}
    };
  }
  componentWillMount() {
    const params = this.$router.params;
    this.setState({ params });
    wx.nim.setCurrSession(`p2p-${params.to}`);
    Taro.setNavigationBarTitle({ title: `与${params.nickName}聊天` });
    wx.nim.getHistoryMsgs({
      scene: "p2p",
      to: params.to,
      asc: true,
      done: (err, res) => {
        this.setState({
          messages: res.msgs,
          scrollIntoView: "scrollIntoView" + (res.msgs.length - 1)
        });
      }
    });
  }
  componentDidMount() {
    Taro.eventCenter.on("onmsg", msg => {
      const params = this.$router.params;
      const { value, messages } = this.state;
      if (params.to == msg.from) {
        messages.push(msg);
        this.setState({
          messages,
          scrollIntoView: "scrollIntoView" + (messages.length - 1)
        });
      }
    });
    Taro.eventCenter.on("onupdatesession", session => {
      const { value, messages } = this.state;
      const { lastMsg } = session;
      if (lastMsg.status === "sending") {
        messages.push(lastMsg);
      }
      if (lastMsg.status === "fail") {
        Taro.atMessage({
          message: "消息发送失败",
          type: "error"
        });
      }
      this.setState({
        messages,
        scrollIntoView: "scrollIntoView" + (messages.length - 1)
      });
    });
  }
  componentWillUnmount() {
    const { params } = this.state;
    // wx.nim.resetSessionUnread(`p2p-${params.to}`)
    wx.nim.resetCurrSession();
    Taro.eventCenter.off("onupdatesession");
    Taro.eventCenter.off("onmsg");
  }
  handleonConfirm = () => {
    const { params } = this.state;
    const { value, messages } = this.state;
    wx.nim.sendText({
      scene: "p2p",
      to: params.to,
      text: value
    });
    this.setState({ value: "" });
  };
  handleChange(value) {
    this.setState({ value });
  }
  handleCurtainClose = () => {
    this.setState({ showcurtain: false });
  };
  onForcePush = item => {
    this.setState({ showcurtain: item });
  };
  handleClick = value => {
    const { showcurtain } = this.state;
    switch (value) {
      case 1:
        const postdata = {
          receiverId: Number(showcurtain.to),
          content: showcurtain.text
        };
        Taro.showLoading();
        this.props
          .postWxForcepush(postdata)
          .then(res => {
            Taro.hideLoading();
            Taro.atMessage({
              message: "推送成功",
              type: "success"
            });
          })
          .catch(err => {
            Taro.atMessage({
              message: "推送失败" + err.message,
              type: "error"
            });
            Taro.hideLoading();
          });
        this.setState({ showcurtain: false });
        break;
      case 2:
        Taro.navigateTo({ url: "/pages/vip/index" });
        break;
      default:
    }
  };
  render() {
    const { deviceinfo } = this.props.commonReducer;
    const { userinfo, userinfodetail } = this.props.userReducer;
    const { messages, scrollIntoView, showcurtain, params } = this.state;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 97
    );
    let condition = false;
    if (messages) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    var isvip =
      new Date(userinfodetail.vipEndAt).getTime() > new Date().getTime();
    return (
      <BaseView condition={condition}>
        <ScrollView
          scrollY={true}
          style={`height:${scrollheight}`}
          scrollIntoView={scrollIntoView}
        >
          {messages &&
            messages.map((item, index) => {
              const { from, idServer, text } = item;
              const isme = userinfo.userId == from;
              return (
                <chatItem
                  id={"scrollIntoView" + index}
                  isme={isme}
                  key={idServer}
                  item={item}
                  avatar={isme ? userinfo.avatarUrl : params.avatarUrl}
                  onForcePush={this.onForcePush}
                />
              );
            })}
          <HeightView height={50} color="transparent" />
        </ScrollView>
        <View className="bottomview">
          <AtInput
            clear={true}
            border={true}
            cursorSpacing="20"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            onConfirm={this.handleonConfirm.bind(this)}
            confirmType="完成"
            placeholder="请输入聊天信息"
          />
        </View>
        <AtCurtain
          isOpened={Boolean(showcurtain)}
          onClose={this.handleCurtainClose}
        >
          <View
            style="padding:20px;border-radius:5px"
            className="bg_white text_center"
          >
            <View>{isvip ? "确认推至客户?" : "强推为VIP特权"}</View>
            {isvip && <HeightView height={100} color="transparent" />}
            <View style="font-size:16px" className="text_black_light">
              -强推信息,直接触达客户微信列表-
            </View>
            {isvip && <HeightView height={100} color="transparent" />}
            {!isvip && (
              <View style="font-size:16px" className="text_black_light">
                开通VIP特权,享受每天强推消息
              </View>
            )}
            {!isvip && <AtIcon value="sketch" color="#f97b43" size={150} />}
            {isvip && (
              <AtButton type="primary" onClick={this.handleClick.bind(this, 1)}>
                确认推送
              </AtButton>
            )}
            <HeightView height={20} color="transparent" />
            {!isvip && (
              <AtButton type="primary" onClick={this.handleClick.bind(this, 2)}>
                开通VIP特权
              </AtButton>
            )}
          </View>
        </AtCurtain>
        <AtMessage />
      </BaseView>
    );
  }
}
