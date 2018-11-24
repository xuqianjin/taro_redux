import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";

import { AtList, AtListItem, AtBadge, AtLoadMore } from "taro-ui";

import BaseView from "../../components/BaseView";

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
  componentWillMount() {}
  handleClick = item => {
    Taro.navigateTo({ url: "/pages/chat/index" });
  };
  render() {
    const { sessions } = this.props.commonReducer;
    let condition = false;
    if (sessions) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    return (
      <BaseView condition={condition}>
        <AtList>
          {sessions &&
            sessions.map(item => {
              const { lastMsg, unread, updateTime } = item;
              const { fromNick, latestMessage, text } = lastMsg;
              return (
                <View
                  key={item.id}
                  className="item"
                  onClick={this.handleClick.bind(this, item)}
                >
                  <AtBadge value={unread || ""} className="badge" />
                  <AtListItem
                    title={fromNick || "未知昵称"}
                    note={text}
                    extraText={moment(updateTime).calendar()}
                    thumb={
                      "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
                    }
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
