import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import ImageView from "../../components/ImageView";
import { View, Button } from "@tarojs/components";
import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
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
  config = {
    navigationBarTitleText: "分享红包",
    navigationBarBackgroundColor: "#d65c44"
  };
  onShareAppMessage() {
    const { usercarte } = this.props.userReducer;
    const { id, name } = usercarte;
    const { redpackId } = this.$router.params;
    return {
      title: name + "的名片红包",
      path: `/pages/index?goto=carte&userId=${id}&name=${name}&redpackId=${redpackId}`
    };
  }
  render() {
    const { usercarte } = this.props.userReducer;
    return (
      <View className="sharecontent">
        <View className="shareheader">
          <ImageView baseclassname="shareheaderimg" src={usercarte.avatarUrl} />
        </View>
        <Button className="sharebutton" openType="share">
          发红包给好友或群聊
        </Button>
        <View className="sharedesc">
          <Text>未领取红包将于24小时退回多装获客宝账户</Text>
        </View>
      </View>
    );
  }
}
