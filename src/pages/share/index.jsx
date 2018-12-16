import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import ImageView from "../../components/ImageView";
import { AtModal, AtCurtain, AtButton, AtMessage } from "taro-ui";
import "./style.scss";
import { postWxMagicMessage } from "../../reducers/userReducer";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postWxMagicMessage
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      showcurtain: true
    };
  }
  handleJoinClose = () => {
    this.setState({ showcurtain: false });
    Taro.navigateBack();
  };
  componentDidMount() {
    const params = this.$router.params;
    const { type, id } = params;
    var data = "";
    switch (Number(type)) {
      case 1: //文章分享
        data = { hook: `sharearticle:${id}` };
        break;
      case 2: //案例分享
        data = { hook: `sharedemo:${id}` };
        break;
      case 3: //加群
        data = { hook: `joingroup` };
        break;
      default:
    }
    data && this.props.postWxMagicMessage(data);
  }
  render() {
    const { showcurtain } = this.state;
    const params = this.$router.params;
    const { type, id } = params;
    var title = "";
    var button = "";
    var desc = "";
    var img = "";
    switch (Number(type)) {
      case 1:
        title = "文章分享提示";
        desc = '在客服会话回复"6"扫码分享';
        button = "回复6扫码分享";
        img = `${CDN_URL}sharearticle.jpg`;
        break;
      case 2:
        title = "案例分享提示";
        desc = '在客服会话回复"6"扫码分享';
        button = "回复6扫码分享";
        img = `${CDN_URL}sharedemo.jpg`;
        break;
      case 3:
        title = "进群提示";
        desc = '在客服会话回复"6"扫码进群';
        button = "回复6扫码进群";
        img = `${CDN_URL}intro_join_group.jpg`;
        break;
      default:
    }
    const jion = (
      <View
        style="padding:20px;border-radius:5px"
        className="bg_white text_center"
      >
        <View>{title}</View>
        <View style="font-size:16px" className="text_black_light">
          {desc}
        </View>
        {img && (
          <ImageView baseclassname="curtainimg" src={img} mode="widthFix" />
        )}
        <AtButton type="primary" openType="contact">
          {button}
        </AtButton>
      </View>
    );
    return (
      <View>
        <AtCurtain isOpened={showcurtain} onClose={this.handleJoinClose}>
          {jion}
        </AtCurtain>
      </View>
    );
  }
}
