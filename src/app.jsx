import Taro, { Component } from "@tarojs/taro";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import configStore from "./store";
import fundebug from "fundebug-wxjs";

import reducer from "./reducers";
import Index from "./pages/index";

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css");
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css");
}

import "./app.scss";
import "./font/iconfont.scss";

const globalvalue = {
  color: "#6190e8"
};

const store = configStore();

class App extends Component {
  config = {
    pages: [
      "pages/index",
      "pages/login/login",
      "pages/userinfo/edit",
      "pages/userinfo/index",
      "pages/userinfo/articles",
      "pages/userinfo/demos",
      "pages/userinfo/adddesc",
      "pages/userinfo/addtag",
      "pages/userinfo/collect",
      "pages/userinfo/photos",
      "pages/article/index",
      "pages/article/upload",
      "pages/webview/index",
      "pages/webview/demo",
      "pages/message/index",
      "pages/vip/index",
      "pages/chat/index",
      "pages/qrcode/index",
      "pages/qrcode/userqrcode",
      "pages/viewlog/index",
      "pages/share/index",
      "pages/demo/index",
      "pages/demo/uploadh",
      "pages/demo/uploadm",
      "pages/redpack/index",
      "pages/redpack/list",
      "pages/redpack/detail",
      "pages/redpack/money",
      "pages/redpack/share"
    ],
    window: {
      backgroundTextStyle: "dark",
      navigationBarBackgroundColor: APP_COLOR_THEME,
      navigationBarTitleText: "多装获客宝",
      navigationBarTextStyle: "white",
      backgroundColor: APP_COLOR_GRAY,
      backgroundColorTop: APP_COLOR_GRAY,
      enablePullDownRefresh: false
    }
  };

  constructor(props) {
    super(props);
  }

  checkWxUpdate = () => {
    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {
        //如果有新版本

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function() {
          //当新版本下载完成，会进行回调
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，单击确定重启应用",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          });
        });

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function() {
          //当新版本下载失败，会进行回调
          wx.showModal({
            title: "提示",
            content: "检查到有新版本，但下载失败，请检查网络设置",
            showCancel: false
          });
        });
      }
    });
  };

  componentWillMount() {
    fundebug.init({
      apikey:
        "b5f7a6887104e30832573b69bb727b6ba573ad9df9dd806650a39a229d0e1f4a",
      releaseStage: process.env.NODE_ENV,
      silent: process.env.NODE_ENV === "development",
      setSystemInfo: true,
      monitorMethodCall: true,
      monitorMethodArguments: true,
      monitorHttpData: true
    });
    wx.fundebug = fundebug;
    this.checkWxUpdate();
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
