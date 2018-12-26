import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import HeightView from "../../components/HeightView";
import "./style.scss";
import { AtAvatar } from "taro-ui";
import { changeSrc } from "../../lib/utils";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer
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
  }
  static defaultProps = {
    item: {},
    onClick: () => {}
  };
  static options = {
    addGlobalClass: true
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { avatarUrl, nickName, createdAt, money, desc, onClick } = this.props;
    const color = APP_COLOR_GRAY;
    return (
      <View onClick={onClick}>
        <HeightView height={2} color={color} />
        <View className="at-row at-row__align--center bg_white">
          <View style="margin:10rpx" className="at-col at-col-1 at-col--auto">
            <AtAvatar size="small" circle={true} image={changeSrc(avatarUrl)} />
          </View>
          <View className="at-row at-row__justify--between">
            <View style="margin-left:20rpx;font-weight:normal">
              <View style="font-size:28rpx">{nickName || ""}</View>
              <View className="text_black_light" style="font-size:25rpx">
                {createdAt || ""}
              </View>
            </View>
            <View style="margin-right:20rpx">
              <View style="font-size:28rpx">{money || ""}</View>
              <View className="text_black_light" style="font-size:25rpx">
                {desc || ""}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
