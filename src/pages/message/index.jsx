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
  static defaultProps = {};
  config = {
    navigationBarTitleText: "我的消息"
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  componentDidMount() {}
  handleClick = item => {
    const { toUserId, id } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${toUserId}`
    });
  };
  render() {
    const { visitchart, messageboxes } = this.props.customerReducer;
    let condition = false;
    if (true) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    return (
      <BaseView condition={condition}>
        <AtList>
          {messageboxes &&
            messageboxes.map(item => {
              const { User, SocketMessage, latestMessageAt, numUnread } = item;
              return (
                <View
                  key={item.id}
                  className="item"
                  onClick={this.handleClick.bind(this, item)}
                >
                  <AtBadge value={numUnread || ""} className="badge" />
                  <AtListItem
                    title={User.nickName || "未知昵称"}
                    extraText={moment(latestMessageAt).calendar()}
                    note={SocketMessage.content}
                    thumb={
                      changeSrc(User.avatarUrl) ||
                      require("../../static/icon/avatar.png")
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
