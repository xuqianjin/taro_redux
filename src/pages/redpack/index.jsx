import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, Text, Input, ScrollView } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
import { AtButton, AtMessage } from "taro-ui";
import { postRedPack, postRedPackCharge } from "../../reducers/redpackReducer";
import RedpackCenter from "./RedpackCenter";
import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ postRedPack, postRedPackCharge }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "名片红包",
    navigationBarBackgroundColor: "#d65c44",
    backgroundColor: "#d65c44",
    backgroundColorTop: "#d65c44"
  };
  constructor(props) {
    super(props);
    this.state = {
      money: "",
      amount: ""
    };
  }

  handleChange = (type, value) => {
    const { detail } = value;
    this.setState({ [type]: detail.value });
  };
  handleClick = type => {
    const { userinfo } = this.props.userReducer;
    switch (type) {
      case 0:
        Taro.navigateTo({
          url: `/pages/userinfo/index?userId=${userinfo.userId}`
        });
        break;
      case 1:
        Taro.navigateTo({ url: "/pages/redpack/list" });
        break;
      case 2:
        Taro.navigateTo({ url: "/pages/redpack/share" });
        break;
      default:
    }
  };
  handleSubmit = () => {
    const { money, amount } = this.state;
    if (!Number(money)) {
      Taro.atMessage({ message: "请输入正确红包金额", type: "error" });
      return;
    }
    if (Number(money) < 0.1 || Number(money) > 200) {
      Taro.atMessage({ message: "红包金额最小0.1元最大200元", type: "error" });
      return;
    }
    if (!Number(amount)) {
      Taro.atMessage({ message: "请输入正确红包个数", type: "error" });
      return;
    }
    if (Number(amount) < 1 || Number(amount) > 500) {
      Taro.atMessage({ message: "红包个数最小1个最大500个", type: "error" });
      return;
    }
    const postdata = {
      money: Number(money) * 100, //元转分
      amount: Number(amount)
    };
    Taro.showLoading();
    this.props
      .postRedPack(postdata)
      .then(({ value }) => {
        const chargedata = {
          redpackId: value.id,
          channel: "WX_LITE"
        };
        return this.props.postRedPackCharge(chargedata);
      })
      .then(({ value }) => {
        this.redpack = value;
        return Taro.requestPayment(value);
      })
      .then(res => {
        Taro.showToast({ title: "支付成功" });
        Taro.hideLoading();
        Taro.navigateTo({
          url: `/pages/redpack/share?redpackId=${this.redpack.id}`
        });
      })
      .catch(err => {
        Taro.hideLoading();
      });
  };
  render() {
    const { money, amount } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 300 - 20
    );
    return (
      <View className="content">
        <AtMessage />
        <View className="header">
          <View className="title">一个名片红包=一个潜在客户</View>
          <View className="desc">所有访客都可不加好友直接微信聊天</View>
          <View className="desc">"推至客户"直接触达微信聊天窗口</View>
        </View>
        <RedpackCenter />
        <ScrollView
          scrollY={true}
          style={`height:${scrollheight}`}
          className="body"
        >
          <ImageView
            onClick={this.handleClick.bind(this, 0)}
            src={"https://cdnbcsl.baicaiyun.com/hongbaomp.png"}
            baseclassname="goimage"
            mode="widthFix"
          />
          <HeightView height={50} color="transparent" />
          <View className="at-row at-row__justify--center at-row at-row__align--center inputview">
            <Text className="input-title">红包金额</Text>
            <View className="input">
              <Input
                value={money}
                onInput={this.handleChange.bind(this, "money")}
                placeholder="填写红包总金额(元)"
                type="digit"
              />
            </View>
          </View>
          <View className="at-row at-row__justify--center at-row at-row__align--center inputview">
            <Text className="input-title">红包个数</Text>
            <View className="input">
              <Input
                value={amount}
                onInput={this.handleChange.bind(this, "amount")}
                placeholder="填写红包个数"
                type="number"
              />
            </View>
          </View>
          <HeightView height={100} color="transparent" />
          <View className="button" onClick={this.handleSubmit}>
            生成名片红包
          </View>
          <View className="text_center">
            <Text
              className="bottomdesc"
              onClick={this.handleClick.bind(this, 1)}
            >
              红包记录
            </Text>
            <Text className="bottomdis">|</Text>
            <Text
              className="bottomdesc"
              onClick={this.handleClick.bind(this, 2)}
            >
              使用帮助
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
