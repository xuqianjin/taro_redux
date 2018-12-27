import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
import "./style.scss";

export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    onClose: () => {}
  };
  static options = {
    addGlobalClass: true
  };
  handleConfirm = () => {
    this.props.onClose();
  };
  handleShare = () => {
    const { redpackId } = this.props;
    Taro.navigateTo({
      url: `/pages/redpack/share?redpackId=${redpackId}`
    });
  };
  render() {
    const style = `background: url(${CDN_URL}hbfxbj2.png) no-repeat; background-size: 100% 100%;`;
    const { money } = this.props;
    return (
      <View className="redpackOpen" style={style}>
        <HeightView height={50} color="transparent" />
        <View className="redpackOpenTitle text_center">收到一个名片红包</View>
        <HeightView height={100} color="transparent" />
        <View className="redpackOpenMoney text_center">{money + "元"}</View>
        <HeightView height={50} color="transparent" />
        <View
          className="redpackOpenButton text_center"
          onClick={this.handleConfirm.bind(this)}
        >
          确认
        </View>
        <HeightView height={50} color="transparent" />
        <View
          className="redpackOpenButton text_center"
          onClick={this.handleShare.bind(this)}
        >
          分享群里再得红包
        </View>
        <HeightView height={50} color="transparent" />
        <View className="redpackOpenDesc text_center text_white">
          看看大家的手气
        </View>
      </View>
    );
  }
}
