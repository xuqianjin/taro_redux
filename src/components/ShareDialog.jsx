import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import { AtFloatLayout } from "taro-ui";
import HeightView from "./HeightView";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    share: {}
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickCircle = () => {
    Taro.navigateTo({ url: "/pages/qrcode/index" });
    this.handleClose();
  };
  handleClickFriend = () => {
    this.handleClose();
  };
  handleClose = () => {
    this.props.onClose && this.props.onClose();
  };
  render() {
    const { isOpened } = this.props;
    const width = Taro.pxTransform(100);
    const imgstyle = `width:${width}`;
    const buttonstyle = "border:0;line-height:1;font-size:16px;";
    const textstyle = "color:#666;font-size:15px;margin-top:20px;";
    return (
      <AtFloatLayout
        isOpened={isOpened}
        title="选择分享位置"
        onClose={this.handleClose}
      >
        <HeightView height={30} color="transparent" />
        <View className="at-row">
          <Button
            open-type="share"
            style={buttonstyle}
            className="at-col"
            plain={true}
            onClick={this.handleClickFriend}
          >
            <Image
              style={imgstyle}
              src={require("../static/icon/wechat_friend.png")}
              mode="widthFix"
            />
            <View style={textstyle}>微信好友</View>
          </Button>
          <Button
            style={buttonstyle}
            className="at-col"
            plain={true}
            onClick={this.handleClickCircle}
          >
            <Image
              style={imgstyle}
              src={require("../static/icon/wechat_circle.png")}
              mode="widthFix"
            />
            <View style={textstyle}>朋友圈</View>
          </Button>
        </View>
        <HeightView height={30} color="transparent" />
      </AtFloatLayout>
    );
  }
}
