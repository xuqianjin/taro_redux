import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
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
    console.log(
      `/pages/index?goto=carte&userId=${id}&name=${name}&redpackId=${redpackId}`
    );
    return {
      title: `［有人@你］${name}邀请您领取现金红包，快快来拆！`,
      path: `/pages/index?goto=carte&userId=${id}&name=${name}&redpackId=${redpackId}`,
      imageUrl: "https://djcdn.baicaiyun.com/hbfnt.png"
    };
  }
  render() {
    const { usercarte } = this.props.userReducer;
    return (
      <View className="sharecontent">
        <HeightView height={75} color="transparent" />
        <View className="redpackbg">
          <ImageView baseclassname="shareheaderimg" src={usercarte.avatarUrl} />
          <Button className="sharebutton" openType="share">
            分享给好友或群
          </Button>
        </View>
        <View className="sharedesc">
          <Text>未领取红包将于24小时退回多装获客宝账户</Text>
        </View>
      </View>
    );
  }
}
