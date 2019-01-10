import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import url from "url";
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtCurtain,
  AtButton,
  AtMessage
} from "taro-ui";

import Home from "./home";
import Customer from "./customer";
import User from "./user";
import "moment/locale/zh-cn";
import moment from "moment";

import IO from "weapp.socket.io";

import ImageView from "../components/ImageView";
import FormidButton from "../components/FormidButton";
import BaseView from "../components/BaseView";
import AtTabBar from "../components/TabBar";
import HeightView from "../components/HeightView";
import Login from "./login/login";

import request from "../reducers/request";
import { encodeSearchParams } from "../lib/utils";

import {
  getDeviceInfo,
  setState,
  getStatistic,
  getImToken,
  getVipKinds,
  getSysMetaData
} from "../reducers/commonReducer";
import {
  postWxLogin,
  postWxLoginUid,
  postWxMagicMessage,
  getDebugToken,
  getUserCarte,
  getUserCarteDesc,
  getUserInfoDetail,
  putWxUserInfo,
  putUserCarte
} from "../reducers/userReducer";
import {
  getVisitGuest,
  getVisitIntent,
  getVisitLog,
  putVisit,
  postViewlogs,
  getMessageBoxes
} from "../reducers/customerReducer";

import { getRedPackStatistic } from "../reducers/redpackReducer";

import ShareDialog from "../components/ShareDialog";
import "./style.scss";

const mapStateToProps = state => {
  return {
    commonReducer: state.commonReducer,
    userReducer: state.userReducer,
    customerReducer: state.customerReducer,
    redpackReducer: state.redpackReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postWxLogin,
      postWxLoginUid,
      postWxMagicMessage,
      getDebugToken,
      getDeviceInfo,
      getStatistic,
      getUserCarte,
      getUserCarteDesc,
      getUserInfoDetail,
      getVisitGuest,
      getVisitIntent,
      getVisitLog,
      postViewlogs,
      getImToken,
      getVipKinds,
      putWxUserInfo,
      putUserCarte,
      getMessageBoxes,
      getRedPackStatistic,
      getSysMetaData,
      setState
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Index extends Component {
  config = {};
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showauth: false,
      showshare: false,
      showcurtain: false,
      showsharemsg: false,
      senderId: false
    };
    this.authCode = "";
    this.ErrNoUnionid = false;
  }
  checkNavigateTo = () => {
    const params = this.$router.params;
    var newobj = JSON.parse(JSON.stringify(params));
    const { scene } = newobj;
    const { showsharemsg } = this.state;
    if (scene) {
      const params = decodeURIComponent(scene);
      if (params.indexOf("?") === 0) {
        //参数自带问号
        newobj = url.parse(params, true).query;
      } else {
        //不带问号添加问号
        newobj = url.parse("?" + params, true).query;
      }
    }
    const { goto, name, redpackId } = newobj;
    if (goto) {
      delete newobj.goto;
      const { userinfo } = this.props.userReducer;

      const pathkey = {
        visitors: "/pages/viewlog/index",
        vip: "/pages/vip/index",
        messages: "/pages/message/index",
        carte: `/pages/userinfo/index`,
        article: "/pages/webview/index",
        demo: "/pages/webview/demo"
      };
      if (goto === "carte") {
        newobj = Object.assign({}, { userId: userinfo.userId }, newobj);
      }
      if (
        goto === "carte" &&
        newobj.userId != userinfo.userId &&
        !showsharemsg
      ) {
        if (redpackId) {
          // this.setState({
          //   showsharemsg: `您正在领取${name || ""}分享给你名片红包`,
          //   senderId: newobj.userId
          // });
        } else {
          this.setState({
            showsharemsg: `您正在查看${name || ""}分享给你名片`,
            senderId: newobj.userId
          });
          return;
        }
      }
      if (goto === "article" && !showsharemsg) {
        this.setState({
          showsharemsg: `您正在查看${name || ""}分享给你文章`,
          senderId: newobj.userId
        });
        return;
      }
      if (goto === "demo" && !showsharemsg) {
        this.setState({
          showsharemsg: `您正在查看${name || ""}分享给你案例`,
          senderId: newobj.userId
        });
        return;
      }
      const redirectTourl = `${pathkey[goto]}?${encodeSearchParams(newobj)}`;
      Taro.navigateTo({ url: redirectTourl });
      this.setState({ showsharemsg: "", senderId: false });
    }
  };
  componentWillMount() {
    Taro.eventCenter.on("getUserCarte", force => {
      const { userinfo } = this.props.userReducer;
      this.props.getUserCarte(userinfo.userId);
    });
    Taro.eventCenter.on("getUserInfoDetail", () => {
      if (!this.props.userReducer.userinfodetail) {
        this.props.getUserInfoDetail();
      }
    });
    Taro.eventCenter.on("postViewlogs", data => {
      this.props.postViewlogs(data);
    });
    Taro.eventCenter.on("getCustomer", () => {
      if (
        !this.props.customerReducer.visitguest ||
        !this.props.customerReducer.visitintent
      ) {
        this.props.getVisitGuest();
        this.props.getVisitIntent();
      }
    });
    Taro.eventCenter.on("getMessageBoxes", () => {
      this.props.getStatistic();
    });
    Taro.eventCenter.on("getRedPackStatistic", () => {
      this.props.getSysMetaData();
      this.props.getRedPackStatistic();
    });
  }

  componentDidMount() {
    this.props.getDeviceInfo();
    Taro.login()
      .then(res => {
        this.authCode = res.code;
        return this.props.postWxLogin({ code: res.code });
      })
      .then(res => {
        Taro.eventCenter.trigger("getMessageBoxes");
        Taro.eventCenter.trigger("getUserCarte");
        Taro.eventCenter.trigger("getCustomer");
        Taro.eventCenter.trigger("getUserInfoDetail");
        Taro.eventCenter.trigger("getRedPackStatistic");
        this.initSocket(res.value.token);
        //新用户未授权
        if (!res.value.nickName) {
          throw new Error("noAuth");
        }
      })
      .then(res => {
        return Taro.getSetting().then(res => {
          const { authSetting } = res;
          if (!authSetting["scope.userInfo"]) {
            throw new Error("noAuth");
          }
        });
      })
      .then(res => {
        this.checkNavigateTo();
      })
      .catch(err => {
        if (err.message === "noAuth") {
          this.setState({ showauth: true });
        }
        if (err.code === "ErrNoUnionid") {
          this.ErrNoUnionid = true;
          this.setState({ showauth: true });
        }
      });
  }

  initSocket = token => {
    wx.socket = IO.connect(
      API_HOST,
      {
        path: "/s",
        transports: ["websocket"]
      }
    );
    wx.socket.on("connect", () => {
      wx.socket.emit("authenticate", { token }, err => {}); // 登录, 链接后需要立刻调用
      wx.socket.emit("leaveChat", null);
    });
    wx.socket.on("msgnotify", msg => {
      Taro.atMessage({
        message: `${msg.name}给你发来消息`,
        type: "success"
      });
      Taro.eventCenter.trigger("getMessageBoxes");
    });
    wx.socket.on("msg", msg => {
      const { id, ...rest } = msg;
      const postdata = {
        userId: id,
        createdAt: new Date(),
        ...rest
      };
      Taro.eventCenter.trigger("onupdatemsg", postdata);
    });
  };

  saveUnreadToLocal = newsessions => {
    const KEY = "todaymsg";
    const todaymsg = Taro.getStorageSync(KEY);
    var totalunread = 0;
    for (var session of newsessions) {
      totalunread += session.unread;
    }
    //有存过数据且日期时间同一天
    if (
      todaymsg &&
      moment(todaymsg.time).format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
    ) {
      const { nummsg, time } = todaymsg;
      totalunread = totalunread + nummsg;
    }
    const data = { nummsg: totalunread, time: new Date().getTime() };
    Taro.setStorageSync(KEY, data);
  };

  onShareAppMessage() {
    return {
      title: "多装获客宝",
      path: `/pages/index`
    };
  }
  componentDidShow() {}

  componentDidHide() {}

  handleMenuClick = current => {
    this.setState({ current });
  };
  handleAuthClose = () => {
    Taro.atMessage({
      message: "请先授权",
      type: "error"
    });
  };
  handleShare = () => {
    this.setState({ showshare: true });
  };
  handleJoin = () => {
    this.props.postWxMagicMessage({ hook: "joingroup" });
    this.setState({ showcurtain: true });
  };
  handleJoinClose = () => {
    this.setState({ showcurtain: false });
  };
  handleShareClose = () => {
    this.setState({ showshare: false });
  };
  handleShareMsgClose = () => {
    this.setState({ showsharemsg: false });
  };
  getMenuData = () => {
    const { statistic } = this.props.commonReducer;
    var unread = statistic.numUnreadMsgs;
    return [
      {
        title: "首页",
        iconType: "home"
      },
      {
        title: "客户",
        iconType: "customer",
        iconPrefixClass: "iconfont"
      },
      {
        title: "我的",
        iconType: "user",
        text: unread ? unread : "",
        max: 99
      }
    ];
  };
  onGetUserInfo = async res => {
    const { detail } = res;
    const { encryptedData, iv, errMsg, userInfo } = detail;
    if (errMsg === "getUserInfo:ok") {
      const { avatarUrl, gender, nickName } = userInfo;
      this.setState({ showauth: false });
      if (this.ErrNoUnionid) {
        //需要绑定unionid
        await this.props.postWxLoginUid({
          encryptedData,
          iv,
          code: this.authCode
        });
      } else {
        await this.props.putWxUserInfo({ encryptedData, iv });
      }
      await this.props.putUserCarte({ avatarUrl, gender, name: nickName });
      this.componentDidMount();
    }
  };
  render() {
    const { deviceinfo, statistic, sysmetadata } = this.props.commonReducer;
    const { usercarte, userinfo, userinfodetail } = this.props.userReducer;
    const { visitguest, visitintent } = this.props.customerReducer;
    const { redpackstatistic } = this.props.redpackReducer;
    const {
      current,
      showauth,
      showshare,
      showsharemsg,
      senderId,
      showcurtain
    } = this.state;
    const menuData = this.getMenuData();
    let condition = false;
    if (deviceinfo && userinfo && statistic) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const jion = (
      <View
        style="padding:20px;border-radius:5px"
        className="bg_white text_center"
      >
        <View style="font-size:20px;">进群提示</View>
        <View style="font-size:14px" className="text_black_light">
          {'在客服会话回复"6"扫码进群'}
        </View>
        <ImageView
          baseclassname="curtainimg"
          src={`${CDN_URL}intro_join_group.jpg`}
          mode="widthFix"
        />
        <AtButton type="primary" openType="contact">
          回复6扫码进群
        </AtButton>
      </View>
    );
    const auth = (
      <View
        style="padding:20px;border-radius:5px"
        className="bg_white text_center"
      >
        <View style="font-size:20px;">授权提示</View>
        <View style="font-size:14px;" className="text_black_light">
          为了获得更好体验,我们需要您的微信授权点击去授权
        </View>
        <ImageView
          basestyle="height:100px;width:100px;"
          src={require("../static/icon/wechat_friend.png")}
        />
        <AtButton
          type="primary"
          openType="getUserInfo"
          onGetUserInfo={this.onGetUserInfo}
        >
          微信授权登录
        </AtButton>
      </View>
    );
    const sharemsg = (
      <View
        style="padding:20px;border-radius:5px"
        className="bg_white text_center"
      >
        <View style="font-size:20px;">分享提示</View>
        <HeightView height={100} color="transparent" />
        <View style="font-size:14px;" className="text_black_light">
          {showsharemsg}
        </View>
        <View style="font-size:14px;" className="text_black_light">
          点击去看看
        </View>
        <HeightView height={100} color="transparent" />
        <FormidButton
          senderId={senderId}
          onClick={this.checkNavigateTo}
          basestyle={`background-color:${APP_COLOR_THEME};line-height:2.5;color:white`}
        >
          去看看
        </FormidButton>
      </View>
    );
    return (
      <View>
        <BaseView condition={condition}>
          <AtTabs current={current} swipeable={false}>
            <AtTabsPane current={current} index={0}>
              <Home
                statistic={statistic}
                userinfo={userinfo}
                redpackstatistic={redpackstatistic}
                sysmetadata={sysmetadata}
                onShare={this.handleShare}
                onJoin={this.handleJoin}
              />
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <Customer
                visitguest={visitguest}
                visitintent={visitintent}
                deviceinfo={deviceinfo}
              />
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <User
                onShare={this.handleShare}
                userinfo={userinfo}
                usercarte={usercarte}
                userinfodetail={userinfodetail}
                statistic={statistic}
                redpackstatistic={redpackstatistic}
                onJoin={this.handleJoin}
              />
            </AtTabsPane>
          </AtTabs>
          <AtTabBar
            fixed={true}
            tabList={menuData}
            onClick={this.handleMenuClick.bind(this)}
            current={current}
          />
        </BaseView>
        <ShareDialog isOpened={showshare} onClose={this.handleShareClose} />
        <AtCurtain isOpened={showcurtain} onClose={this.handleJoinClose}>
          {jion}
        </AtCurtain>
        <AtCurtain isOpened={showauth} onClose={this.handleAuthClose}>
          {auth}
        </AtCurtain>
        <AtCurtain isOpened={!!showsharemsg} onClose={this.handleShareMsgClose}>
          {sharemsg}
        </AtCurtain>
        <AtMessage />
      </View>
    );
  }
}

export default Index;
