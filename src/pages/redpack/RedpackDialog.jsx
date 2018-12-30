import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
import "./style.scss";
import { AtCurtain } from "taro-ui";
import {
  getRedPackDetail,
  getRedPackOpen
} from "../../reducers/redpackReducer";

const statusmap = {
  0: "该红包未支付",
  1: "领取红包",
  2: "该红包已领完",
  3: "该红包已过期"
};

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRedPackDetail, getRedPackOpen }, dispatch);
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
      showDialog: false,
      openRedpack: "",
      redpack: ""
    };
  }
  static defaultProps = {
    onClose: () => {}
  };
  static options = {
    addGlobalClass: true
  };
  componentWillMount() {
    const { redpackId } = this.props;
    if (redpackId) {
      this.requstRedpack(redpackId);
    }
  }
  requstRedpack = redpackId => {
    const { userinfo } = this.props.userReducer;
    this.props.getRedPackDetail(redpackId).then(({ value }) => {
      const { RedpackPieces } = value;
      const openRedpack = RedpackPieces.find(
        item => item.Receiver.id === userinfo.userId
      );
      this.setState({
        showDialog: true,
        redpack: value,
        openRedpack
      });
    });
  };
  closeOpen = () => {
    this.setState({ showDialog: false });
  };
  handleRedpackOpen = () => {
    const { redpackId } = this.props;
    const { openRedpack, redpack } = this.state;
    if (redpack.status !== 1) {
      return;
    }
    Taro.showLoading();
    this.props
      .getRedPackOpen(redpackId)
      .then(res => {
        Taro.hideLoading();
        this.requstRedpack(redpackId);
      })
      .catch(err => {
        Taro.atMessage({ message: err.message, type: "error" });
        Taro.hideLoading();
      });
  };
  handleShare = () => {
    const { redpackId } = this.props;
    Taro.navigateTo({
      url: `/pages/redpack/share?redpackId=${redpackId}`
    });
  };
  hendleDetail = () => {
    const { redpackId } = this.props;
    Taro.navigateTo({
      url: `/pages/redpack/detail?redpackId=${redpackId}`
    });
  };
  render() {
    const { openRedpack, showDialog, redpack } = this.state;
    const { money } = openRedpack || {};
    const style = openRedpack
      ? `background: url(${CDN_URL}hblq.png) no-repeat; background-size: 100% 100%;`
      : `background: url(${CDN_URL}hbfxbj2.png) no-repeat; background-size: 100% 100%;`;
    return (
      <AtCurtain isOpened={showDialog} onClose={this.closeOpen.bind(this)}>
        {openRedpack ? (
          <View className="redpackOpen" style={style}>
            <HeightView height={50} color="transparent" />
            <View className="redpackOpenTitle text_center">
              您已领取该红包
            </View>
            <HeightView height={100} color="transparent" />
            <View className="redpackOpenMoney text_center">
              {money / 100 + "元"}
            </View>
            <HeightView height={50} color="transparent" />
            <View
              className="redpackOpenButton text_center"
              onClick={this.closeOpen.bind(this)}
            >
              确认
            </View>
            <HeightView height={50} color="transparent" />
            <View
              className="redpackOpenButton text_center"
              onClick={this.handleShare.bind(this)}
            >
              分享给好友或群
            </View>
            <HeightView height={50} color="transparent" />
            <View
              className="redpackOpenDesc text_center text_white"
              onClick={this.hendleDetail.bind(this)}
            >
              看看大家的手气
            </View>
          </View>
        ) : (
          <View className="redpackOpen" style={style}>
            <HeightView height={150} color="transparent" />
            <View className="redpackOpenTitle text_center">
              收到一个名片红包
            </View>
            <HeightView height={200} color="transparent" />
            <View
              className="redpackOpenButton text_center"
              onClick={this.handleRedpackOpen.bind(this)}
            >
              {statusmap[redpack.status]}
            </View>
            <HeightView height={50} color="transparent" />
            <View
              className="redpackOpenDesc text_center text_white"
              onClick={this.hendleDetail.bind(this)}
            >
              看看大家的手气
            </View>
          </View>
        )}
      </AtCurtain>
    );
  }
}
