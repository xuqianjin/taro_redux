import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, ScrollView } from "@tarojs/components";
import moment from "moment";

import {
  AtList,
  AtListItem,
  AtBadge,
  AtForm,
  AtButton,
  AtTextarea,
  AtInput
} from "taro-ui";

import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";

import chatItem from "./chatItem";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = { value: "", messages: [], scrollIntoView: "" };
  }
  componentWillMount() {
    const params = this.$router.params;
    Taro.setNavigationBarTitle({ title: `与${params.nickName}聊天` });
    wx.nim.getHistoryMsgs({
      scene: "p2p",
      to: params.to,
      reverse: true,
      done: (err, res) => {
        this.setState({
          messages: res.msgs,
          scrollIntoView: "scrollIntoView" + (res.msgs.length - 1)
        });
      }
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("onupdatesession");
  }
  handleonConfirm = () => {
    const params = this.$router.params;
    const { value, messages } = this.state;
    const session = wx.nim.sendText({
      scene: "p2p",
      to: params.to,
      text: value
    });
    messages.push(session);
    this.setState({
      value: "",
      messages,
      scrollIntoView: "scrollIntoView" + (messages.length - 1)
    });
  };
  handleChange(value) {
    this.setState({ value });
  }
  render() {
    const { deviceinfo } = this.props.commonReducer;
    const { userinfo } = this.props.userReducer;
    const { messages, scrollIntoView } = this.state;
    const params = this.$router.params;

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
    return (
      <BaseView condition={condition}>
        <ScrollView
          scrollY={true}
          style={`height:${scrollheight}`}
          scrollIntoView={scrollIntoView}
        >
          {messages &&
            messages.map((item, index) => {
              const {
                from,
                latestMessage,
                numUnreadMessages,
                time,
                idServer,
                text
              } = item;
              const isme = userinfo.userId == from;
              return (
                <chatItem
                  id={"scrollIntoView" + index}
                  isme={isme}
                  key={idServer}
                  item={item}
                  avatar={isme ? userinfo.avatarUrl : params.avatarUrl}
                />
              );
            })}
          <HeightView height={50} color="transparent" />
        </ScrollView>
        <View className="bottomview">
          <AtInput
            clear={true}
            border={true}
            cursorSpacing={200}
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            onConfirm={this.handleonConfirm.bind(this)}
            confirmType="完成"
            placeholder="请输入聊天信息"
          />
        </View>
      </BaseView>
    );
  }
}
