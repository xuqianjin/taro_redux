import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Canvas, Button, Image } from "@tarojs/components";

import { AtButton } from "taro-ui";
import HeightView from "../../components/HeightView";
import ImageView from "../../components/ImageView";
import BaseView from "../../components/BaseView";
import { putWxUserInfo, putUserCarte } from "../../reducers/userReducer";

import "./style.scss";
const path4 = require("../../static/icon/wechat_circle.png");
const imgurl = `${CDN_URL}dzhcb_post.jpg`;

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
  componentDidMount() {
    const { usercarte } = this.props.userReducer;
    Taro.getImageInfo({ src: imgurl })
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
    const { avatarTempUrl } = this.state;
    let condition = false;
    if (avatarTempUrl) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    return (
      <BaseView condition={condition}>
        <View onClick={this.handlePreview}>
          <ImageView
            baseclassname="content"
            src={avatarTempUrl}
            mode="widthFix"
          />
        </View>
        <AtButton className="button" type="primary" onClick={this.handleSave}>
          保存名片海报后分享
        </AtButton>
      </BaseView>
    );
  }
}
