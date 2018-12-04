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
import { changeSrc } from "../../lib/utils";

import chatItem from "./chatItem";
import { postWxForcepush, getUserCarteOther } from "../../reducers/userReducer";
import { getMessageBoxesDetail } from "../../reducers/customerReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { postWxForcepush, getUserCarteOther, getMessageBoxesDetail },
    dispatch
  );
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
      messages: "",
      scrollIntoView: "",
      showcurtain: false,
      params: {},
      pagecarte: ""
    };
  }
  componentWillMount() {
    const params = this.$router.params;
    this.setState({ params });
    this.props.getUserCarteOther(params.to).then(res => {
      const { value } = res;
      Taro.setNavigationBarTitle({ title: `与${value.name}聊天` });
      this.setState({ pagecarte: value });
    });
  }
  componentDidShow() {
    this.enterRoom();
  }
  componentDidMount() {
    const params = this.$router.params;
    this.props.getMessageBoxesDetail(Number(params.to)).then(res => {
      const messages = res.value.reverse();
      this.setState({
        messages,
        scrollIntoView: "scrollIntoView" + (messages.length - 1)
      });
    });

    Taro.eventCenter.on("onupdatemsg", session => {
      const { value, messages } = this.state;
      messages.push(session);
      this.setState({
        messages,
        scrollIntoView: "scrollIntoView" + (messages.length - 1)
      });
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("onupdatemsg");
    Taro.eventCenter.off("onnewmsg");
    wx.socket.emit("leaveChat", null);
  }
  enterRoom = () => {
    const params = this.$router.params;
    wx.socket.emit("leaveChat", null);
    wx.socket.emit("enterChat", { toUserId: Number(params.to) }, err => {
      if (err) {
        Taro.atMessage({ message: err.message, type: "error" });
      }
    });
  };
  handleonConfirm = () => {
    const { usercarte } = this.props.userReducer;
    const { value, messages } = this.state;

    wx.socket.emit("msg", { content: value }, err => {
      if (err) {
        Taro.atMessage({ message: err.message, type: "error" });
      } else {
        const postdata = {
          userId: usercarte.id,
          content: value,
          createdAt: new Date()
        };
        Taro.eventCenter.trigger("onupdatemsg", postdata);
        this.setState({ value: "" });
      }
    });
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
    const { messageboxesdetail } = this.props.customerReducer;
    const { usercarte, userinfo, userinfodetail } = this.props.userReducer;
    const { messages, scrollIntoView, showcurtain, pagecarte } = this.state;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 100
    );
    let condition = false;
    if (messages && pagecarte) {
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
              const { userId } = item;
              const isme = userinfo.userId == userId;
              return (
                <chatItem
                  id={"scrollIntoView" + index}
                  isme={isme}
                  key={index}
                  item={item}
                  avatar={
                    isme
                      ? changeSrc(usercarte.avatarUrl)
                      : changeSrc(pagecarte.avatarUrl)
                  }
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
