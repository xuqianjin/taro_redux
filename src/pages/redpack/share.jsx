import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
import { View, Button } from "@tarojs/components";
import { getRedPackDetail } from "../../reducers/redpackReducer";
import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRedPackDetail }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = { redpack: "" };
  }
  config = {
    navigationBarTitleText: "分享红包",
    navigationBarBackgroundColor: "#d65c44",
    backgroundColor: "#d65c44",
    backgroundColorTop: "#d65c44"
  };
  componentWillMount() {
    const { redpackId } = this.$router.params;
    this.props.getRedPackDetail(redpackId).then(({ value }) => {
      this.setState({ redpack: value });
    });
  }
  onShareAppMessage() {
    const { redpack } = this.state;
    const { User } = redpack || {};
    const { id, nickName } = User;
    const { redpackId } = this.$router.params;
    console.log(
      `/pages/index?goto=carte&userId=${id}&name=${nickName}&redpackId=${redpackId}`
    );
    return {
      title: `［有人@你］${nickName}邀请您领取现金红包，快快来拆！`,
      path: `/pages/index?goto=carte&userId=${id}&name=${nickName}&redpackId=${redpackId}`,
      imageUrl: "https://djcdn.baicaiyun.com/hbfnt.png"
    };
  }
  render() {
    const { redpack } = this.state;
    const { User } = redpack || {};
    let condition = false;
    if (redpack) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    return (
      <BaseView condition={condition}>
        <View className="sharecontent">
          <HeightView height={75} color="transparent" />
          <View className="redpackbg">
            {User && (
              <ImageView baseclassname="shareheaderimg" src={User.avatarUrl} />
            )}
            <Button className="sharebutton" openType="share">
              分享给好友或群
            </Button>
            <HeightView height={450} color="transparent" />
            <View className="text_white text_center" style="font-size:16px">
              您的名片红包已生成
            </View>
          </View>
          <View className="sharedesc">
            <Text>未领取红包将于24小时退回多装获客宝账户</Text>
          </View>
        </View>
      </BaseView>
    );
  }
}
