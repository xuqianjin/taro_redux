import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";

import { AtList, AtListItem, AtBadge } from "taro-ui";

import BaseView from "../../components/BaseView";
import { getMessageBoxes } from "../../reducers/customerReducer";

import moment from "moment";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getMessageBoxes
    },
    dispatch
  );
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
    this.props.getMessageBoxes();
  }

  render() {
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
    return (
      <BaseView>
        <AtList>
          {data.map(item => {
            const { User, latestMessage, numUnreadMessages } = item;
            return (
              <View key={User.id} className="item">
                <AtBadge value={numUnreadMessages || ""} className="badge" />
                <AtListItem
                  title={User.nickName}
                  note={latestMessage.content}
                  extraText={moment(latestMessage.createdAt).calendar()}
                  thumb={User.avatarUrl}
                />
              </View>
            );
          })}
        </AtList>
      </BaseView>
    );
  }
}
