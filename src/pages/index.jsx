import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import {
  AtTabBar,
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
import ImageView from "../components/ImageView";
import "moment/locale/zh-cn";

import NimSDK from "../lib/NIM_Web_SDK_weixin_v5.8.0";

import BaseView from "../components/BaseView";

import request from "../reducers/request";

import {
  getDeviceInfo,
  setState,
  getStatistic,
  getImToken,
  getVipKinds
} from "../reducers/commonReducer";
import {
  postWxLogin,
  postWxMagicMessage,
  getDebugToken,
  getUserCarte,
  getUserInfoDetail
} from "../reducers/userReducer";
import {
  getVisitGuest,
  getVisitIntent,
  getVisitLog,
  putVisit,
  postViewlogs
} from "../reducers/customerReducer";

import ShareDialog from "../components/ShareDialog";
import "./style.scss";

const mapStateToProps = state => {
  return {
    commonReducer: state.commonReducer,
    userReducer: state.userReducer,
    customerReducer: state.customerReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postWxLogin,
      postWxMagicMessage,
      getDebugToken,
      getDeviceInfo,
      getStatistic,
      getUserCarte,
      getUserInfoDetail,
      getVisitGuest,
      getVisitIntent,
      getVisitLog,
      postViewlogs,
      getImToken,
      getVipKinds,
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
      showmodal: false,
      showshare: false,
      showcurtain: false
    };
  }
  componentWillMount() {
    Taro.eventCenter.on("getUserCarte", () => {
      const { userinfo } = this.props.userReducer;
      this.props.getUserCarte(userinfo.userId);
    });
    Taro.eventCenter.on("getUserInfoDetail", () => {
      this.props.getUserInfoDetail();
    });
    Taro.eventCenter.on("postViewlogs", data => {
      this.props.postViewlogs(data);
    });
    Taro.eventCenter.on("getCustomer", () => {
      this.props.getVisitGuest();
      this.props.getVisitIntent();
    });
  }

  componentDidMount() {
    this.props.getDeviceInfo();
    Taro.login()
      .then(res => {
        return this.props.postWxLogin({ code: res.code });
      })
      .then(res => {
        Taro.eventCenter.trigger("getCustomer");
        Taro.eventCenter.trigger("getUserInfoDetail");
        this.props.getStatistic();

        this.props.getImToken().then(({ value }) => {
          this.initNim(value.token);
        });
      });
    Taro.getSetting().then(res => {
      const { authSetting } = res;
      if (!authSetting["scope.userInfo"]) {
        this.setState({ showmodal: true });
      }
    });
  }

  goPage = () => {
    const params = this.$router.params;
    const { path, id } = params || {};
  };
  initNim = imtoken => {
    const { userinfo } = this.props.userReducer;
    const { nickName, avatarUrl, gender, phonenum, userId } = userinfo;
    wx.nim = NimSDK.NIM.getInstance({
      debug: false,
      appKey: NIM_APP_KEY,
      account: userId,
      token: imtoken,
      autoMarkRead: true,
      onconnect: () => {
        wx.nim.updateMyInfo({
          nick: nickName,
          avatar: avatarUrl,
          tel: phonenum
        });
        wx.nim.getLocalSessions({
          done: (err, res) => {
            console.log("getLocalSessions", res);
          }
        });
      },
      onsessions: res => {
        console.log("ssss", res);
        this.props.setState({ sessions: res });
      },
      onupdatesession: res => {
        const { sessions } = this.props.commonReducer;
        Taro.atMessage({
          message: `${res.lastMsg.fromNick}给你发来消息`,
          type: "success"
        });
      },
      onmsg: res => {
        console.log(res);
      },
      onsysmsgunread: res => {
        console.log("onsysmsgunread", res);
      },
      onupdatesysmsgunread: res => {
        console.log(res);
      },
      onsysmsg: res => {
        console.log(res);
      }
    });
  };
  onShareAppMessage() {
    return { title: "多装获客" };
  }
  componentDidShow() {}

  componentDidHide() {}

  handleMenuClick = current => {
    // Taro.eventCenter.trigger("postViewlogs", {
    //   kind: 1,
    //   sourceId: 27,
    //   duration: 20
    // });
    this.setState({ current });
  };
  handleModalConfirm = () => {
    Taro.navigateTo({ url: "/pages/login/login" });
    this.setState({ showmodal: false });
  };
  handleModalClose = () => {
    Taro.navigateTo({ url: "/pages/login/login" });
    this.setState({ showmodal: false });
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
  getMenuData = () => {
    return [
      {
        title: "首页",
        iconType: "home"
      },
      {
        title: "客户",
        iconType: "message"
      },
      {
        title: "我的",
        iconType: "user"
      }
    ];
  };
  render() {
    const { deviceinfo, statistic } = this.props.commonReducer;
    const { usercarte, userinfo, userinfodetail } = this.props.userReducer;
    const { visitguest, visitintent } = this.props.customerReducer;
    const { current, showmodal, showshare, showcurtain } = this.state;
    const menuData = this.getMenuData();

    let condition = false;
    if (deviceinfo && userinfodetail) {
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
        <View>进群提示</View>
        <View style="font-size:16px" className="text_black_light">
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
    return (
      <BaseView condition={condition}>
        <AtTabs current={current}>
          <AtTabsPane current={current} index={0}>
            <Home
              statistic={statistic}
              userinfo={userinfo}
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
              onJoin={this.handleJoin}
              userinfodetail={userinfodetail}
            />
          </AtTabsPane>
        </AtTabs>
        <AtTabBar
          fixed={true}
          tabList={menuData}
          onClick={this.handleMenuClick.bind(this)}
          current={current}
        />
        <AtModal
          isOpened={showmodal}
          title="提示"
          confirmText="去授权"
          onClose={this.handleModalClose.bind(this)}
          onConfirm={this.handleModalConfirm.bind(this)}
          content="为了获得更好体验,我们需要您的微信授权点击去授权"
        />
        <ShareDialog isOpened={showshare} onClose={this.handleShareClose} />
        <AtCurtain isOpened={showcurtain} onClose={this.handleJoinClose}>
          {jion}
        </AtCurtain>
        <AtMessage />
      </BaseView>
    );
  }
}

export default Index;
