import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Canvas, Button, Image } from "@tarojs/components";

import { AtButton } from "taro-ui";
import HeightView from "../../components/HeightView";
import ImageView from "../../components/ImageView";
import BaseView from "../../components/BaseView";
import {
  putWxUserInfo,
  putUserCarte,
  postWxQrCode
} from "../../reducers/userReducer";
import { changeSrc } from "../../lib/utils";

import "./style.scss";
const path4 = require("../../static/icon/wechat_circle.png");
const imgurl = `${CDN_URL}dzhcb_post.jpg`;

const mapStateToProps = state => {
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putWxUserInfo,
      putUserCarte,
      postWxQrCode
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
      qrTempUrl: "",
      canvasHidden: true
    };
  }
  componentDidMount() {
    const { usercarte } = this.props.userReducer;

    this.props
      .postWxQrCode({
        page: `pages/index`,
        scene: `goto=carte&userId=${usercarte.id}`
      })
      .then(({ value }) => {
        const { url } = value;
        Taro.getImageInfo({ src: `${CDN_URL + url}` })
          .then(res => {
            this.setState({ qrTempUrl: res.path });
          })
          .catch(err => {
            Taro.showToast({ title: "图像加载失败" });
          });
      });

    Taro.getImageInfo({ src: changeSrc(usercarte.avatarUrl) })
      .then(res => {
        this.setState({ avatarTempUrl: res.path });
      })
      .catch(err => {
        Taro.showToast({ title: "图像加载失败" });
      });
  }
  handlePreview = () => {
    const { avatarTempUrl } = this.state;
    Taro.previewImage({ urls: [avatarTempUrl] });
  };
  handleSave = () => {
    const { avatarTempUrl } = this.state;
    Taro.saveImageToPhotosAlbum({ filePath: avatarTempUrl });
  };
  onClick = () => {
    const { deviceinfo } = this.props.commonReducer;
    const { windowWidth, windowHeight } = deviceinfo;
    const { avatarTempUrl, qrTempUrl } = this.state;
    const width = windowWidth - 100;
    const height = windowHeight - 200;
    var context = wx.createCanvasContext("canvas");
    context.setFillStyle("#ffe200");
    context.fillRect(0, 0, width, height);
    context.setStrokeStyle("#00ff00");
    context.setLineWidth(5);
    context.rect(50, 50, 500, 300);
    context.stroke();
    context.setStrokeStyle("#ff0000");
    context.setLineWidth(2);
    context.drawImage(qrTempUrl, 0, 10, 200, 200);
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
    const { avatarTempUrl, qrTempUrl } = this.state;
    let condition = false;
    if (avatarTempUrl && qrTempUrl) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const { deviceinfo } = this.props.commonReducer;
    const { windowWidth, windowHeight } = deviceinfo;
    const canvasstyle = `width:${windowWidth - 100}px;height:${windowHeight -
      200}px`;
    return (
      <BaseView condition={condition}>
        <View className="container">
          <Canvas style={canvasstyle} canvasId="canvas" />
        </View>
        <AtButton className="button" type="primary" onClick={this.onClick}>
          保存名片海报后分享
        </AtButton>
      </BaseView>
    );
  }
}
