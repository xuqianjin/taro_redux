import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";
import moment from "moment";

import { AtList, AtListItem, AtBadge, AtLoadMore } from "taro-ui";

import BaseView from "../../components/BaseView";
import { changeSrc } from "../../lib/utils";

import { getVisitChart } from "../../reducers/customerReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getVisitChart }, dispatch);
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
    this.state = { users: [] };
  }
  componentWillMount() {
    this.props.getVisitChart();
    const { sessions } = this.props.commonReducer;
    if (!sessions) {
      return;
    }
    console.log(sessions);
    const ids = sessions.map(session => {
      return session.to;
    });
    wx.nim.getUsers({
      accounts: ids,
      done: (err, res) => {
        let users = [];
        for (var i in sessions) {
          let user = {};
          Object.assign(user, sessions[i], res[i]);
          users.push(user);
        }
        this.setState({ users });
      }
    });
  }
  handleClick = item => {
    const { avatar, to, nick } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${to}&avatarUrl=${avatar}&nickName=${nick}`
    });
  };
  render() {
    const { users } = this.state;
    const { visitchart } = this.props.customerReducer;
    let condition = false;
    if (users) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    return (
      <BaseView condition={condition}>
        <AtList>
          {users &&
            users.map(item => {
              const { lastMsg, unread, updateTime, nick, avatar } = item;
              return (
                <View
                  key={item.id}
                  className="item"
                  onClick={this.handleClick.bind(this, item)}
                >
                  <AtBadge value={unread || ""} className="badge" />
                  <AtListItem
                    title={nick || "未知昵称"}
                    extraText={moment(updateTime).calendar()}
                    note={lastMsg.text}
                    thumb={avatar || require("../../static/icon/avatar.png")}
                  />
                </View>
              );
            })}
        </AtList>
        <AtLoadMore status={"noMore"} />
      </BaseView>
    );
  }
}
