import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";
import moment from "moment";

import { AtList, AtListItem, AtBadge, AtLoadMore, AtAvatar } from "taro-ui";

import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";
import { changeSrc } from "../../lib/utils";
import { getMessageBoxes } from "../../reducers/customerReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getMessageBoxes }, dispatch);
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
  componentWillMount() {
    Taro.eventCenter.on("getMessageBoxes", () => {
      this.props.getMessageBoxes();
    });
    Taro.eventCenter.trigger("getMessageBoxes");
  }
  componentDidMount() {}
  componentWillUnmount() {
    Taro.eventCenter.off("getMessageBoxes");
  }
  handleClick = item => {
    const { toUserId, id } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${toUserId}`
    });
  };
  render() {
    const { messageboxes } = this.props.customerReducer;
    let condition = false;
    if (true) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const imgstyle = `margin:${Taro.pxTransform(20)}`;
    return (
      <BaseView condition={condition}>
        {messageboxes &&
          messageboxes.map(item => {
            const { ToUser, SocketMessage, latestMessageAt, numUnread } = item;
            return (
              <View key={item.id}>
                <View
                  className="at-row bg_white opacity at-row__align--center"
                  onClick={this.handleClick.bind(this, item)}
                >
                  <View
                    style={imgstyle}
                    className="at-col at-col-1 at-col--auto"
                  >
                    <AtBadge value={numUnread || ""}>
                      <AtAvatar
                        circle={true}
                        image={
                          changeSrc(ToUser.avatarUrl) ||
                          require("../../static/icon/avatar.png")
                        }
                      />
                    </AtBadge>
                  </View>
                  <View className="at-col">
                    <View className="at-row at-row__justify--between at-row__align--center">
                      <View className="at-col at-col-1 at-col--auto">
                        {ToUser.nickName || "未知昵称"}
                      </View>
                      <View className="at-col at-col-1 at-col--auto text_right text_black_light timestyle">
                        {moment(latestMessageAt).calendar()}
                      </View>
                    </View>
                    <HeightView height={10} color="transparent" />
                    <View className="text_black_light item-content__info-note  at-col--wrap descstyle">
                      <Text>{SocketMessage.content}</Text>
                    </View>
                  </View>
                </View>
                <HeightView height={10} color="transparent" />
              </View>
            );
          })}
        <AtLoadMore status={"noMore"} />
      </BaseView>
    );
  }
}
