import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Canvas, Button, Image } from "@tarojs/components";

import { AtButton } from "taro-ui";
import HeightView from "../../components/HeightView";
import ImageView from "../../components/ImageView";
import { putWxUserInfo, putUserCarte } from "../../reducers/userReducer";

const path4 = require("../../static/icon/wechat_circle.png");

const mapStateToProps = state => {
  return { userReducer: state.userReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putWxUserInfo,
      putUserCarte
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
      avatarTempUrl: "",
      canvasHidden: true
    };
  }
  componentWillMount() {
    const { usercarte } = this.props.userReducer;
    Taro.getImageInfo({ src: usercarte.avatarUrl }).then(res => {
      this.setState({ avatarTempUrl: res.path });
    });
  }
  onClick = () => {
    var context = wx.createCanvasContext("canvas");
    context.setFillStyle("#ffe200");
    // context.fillRect(0, 0, 375, 667);
    context.fillText("开心", 200, 130);
    context.drawImage(path4, 25, 520, 184, 82);
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    // setTimeout(() => {
    //   wx.canvasToTempFilePath({
    //     canvasId: "canvas",
    //     success: res => {
    //       var tempFilePath = res.tempFilePath;
    //       this.setState({
    //         imagePath: tempFilePath,
    //         canvasHidden: true
    //       });
    //     },
    //     fail: res => {
    //       console.log(res);
    //     }
    //   });
    // }, 200);
  };
  render() {
    const { imagePath } = this.state;
    return (
      <View>
        <Canvas style="width: 300px; height: 200px;" canvasId="canvas" />
        <Image src={imagePath} />
        <Button onClick={this.onClick}>邀请</Button>
      </View>
    );
  }
}
