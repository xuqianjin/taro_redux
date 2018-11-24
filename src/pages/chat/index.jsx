import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";

import {
  AtList,
  AtListItem,
  AtBadge,
  AtForm,
  AtButton,
  AtTextarea
} from "taro-ui";

import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";

import chatItem from "./chatItem";

import moment from "moment";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {
    height: 1,
    color: APP_COLOR_GRAY
  };
  config = {
    navigationBarTitleText: "我的消息"
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    wx.nim.getLocalSessions({
      lastSessionId: 'p2p-29',
      limit: 100,
      done: res => {
        console.log(res);
      }
    });
  }
  handleonConfirm = () => {
    console.log("sss");
  };
  render() {
    const { session } = this.props.commonReducer;
    let data = [
      {
        User: {
          id: 0,
          nickName: "string",
          avatarUrl:
            "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
        },
        latestMessage: {
          id: 0,
          userId: 0,
          toUserId: 0,
          kind: 0,
          content: "这是消息",
          createdAt: "2018-11-20T12:49:12.773Z"
        },
        numUnreadMessages: 1
      },
      {
        User: {
          id: 2,
          nickName: "string",
          avatarUrl:
            "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
        },
        latestMessage: {
          id: 0,
          userId: 0,
          toUserId: 0,
          kind: 0,
          content: "您好",
          createdAt: "2018-11-20T12:49:12.773Z"
        },
        numUnreadMessages: 0
      }
    ];
    const { height, color } = this.props;
    console.log(session);
    return (
      <BaseView>
        {data.map(item => {
          const { User, latestMessage, numUnreadMessages } = item;
          return <chatItem messagetype={User.id} key={User.id} />;
        })}
        {data.map(item => {
          const { User, latestMessage, numUnreadMessages } = item;
          return <chatItem messagetype={User.id} key={User.id} />;
        })}
        {data.map(item => {
          const { User, latestMessage, numUnreadMessages } = item;
          return <chatItem messagetype={User.id} key={User.id} />;
        })}
        <HeightView height={150} color="transparent" />
        <View className="fix" onConfirm={this.handleonConfirm}>
          <AtTextarea
            style="border-radius:0px"
            placeholder="请输入聊天信息"
            showConfirmBar={false}
            fixed={true}
            height="50"
            maxlength={0}
            count={false}
            cursorSpacing={200}
          />
        </View>
      </BaseView>
    );
  }
}
