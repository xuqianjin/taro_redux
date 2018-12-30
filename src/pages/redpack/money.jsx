import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";
import { AtButton, AtMessage } from "taro-ui";

import {
  getRedPackStatistic,
  postRedPackWithDraw
} from "../../reducers/redpackReducer";
import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getRedPackStatistic, postRedPackWithDraw },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      money: ""
    };
  }
  config = {
    navigationBarTitleText: "零钱提现",
    navigationBarBackgroundColor: "#d65c44",
    backgroundColor: "#d65c44",
    backgroundColorTop: "#d65c44"
  };
  componentWillMount() {
    this.props.getRedPackStatistic();
  }
  handleConfirm = () => {
    const { money } = this.state;
    if (!Number(money)) {
      Taro.atMessage({ message: "请输入正确提现金额", type: "error" });
      return;
    }
    if (Number(money) < 0.1 || Number(money) > 200) {
      Taro.atMessage({ message: "提现金额最小0.3元最大200元", type: "error" });
      return;
    }
    const postdata = {
      money: Number(money) * 100 //元转分
    };
    Taro.showLoading();
    this.props
      .postRedPackWithDraw(postdata)
      .then(res => {
        this.props.getRedPackStatistic();
        Taro.showToast({ title: "提现申请成功" });
        Taro.hideLoading();
      })
      .catch(err => {
        Taro.atMessage({
          message: err.message,
          type: "error"
        });
        Taro.hideLoading();
      });
  };
  handleChange = (type, value) => {
    const { detail } = value;
    this.setState({ [type]: detail.value });
  };
  handleAll = () => {
    const { redpackstatistic } = this.props.redpackReducer;
    this.setState({ money: redpackstatistic.moneyLeft / 100 });
  };
  render() {
    const { redpackstatistic } = this.props.redpackReducer;
    const { money } = this.state;
    let condition = false;
    if (redpackstatistic) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    const { moneyLeft } = redpackstatistic || {};
    return (
      <BaseView condition={condition}>
        <HeightView height={100} color="transparent" />
        <View className="bg_white moneyview">
          <View className="at-row at-row__align--center">
            <View className="at-col">账户余额</View>
            <View className="at-col">
              <Text className="moneybig">{moneyLeft / 100}</Text>
              <Text>元</Text>
            </View>
          </View>
          <HeightView height={20} color="transparent" />
          <View>
            <View>提现金额</View>
          </View>
          <View className="at-row at-row__align--center">
            <View className="at-col at-col-1 at-col--auto fontbig">¥</View>
            <Input
              className="at-col"
              value={money}
              onInput={this.handleChange.bind(this, "money")}
              placeholder={`可提现到微信钱包${moneyLeft / 100}元`}
              type="digit"
            />
            <View
              className="at-col at-col-1 at-col--auto text_theme text_right"
              onClick={this.handleAll.bind(this)}
            >
              全部
            </View>
          </View>
          <HeightView height={2} color="#ddd" />
          <HeightView height={20} color="transparent" />
          <View className="text_black_light">
            单次提现金额至少0.3元,最多200元
          </View>
          <HeightView height={50} color="transparent" />
          <View
            className="moneyviewbutton text_center text_white"
            onClick={this.handleConfirm.bind(this)}
          >
            提现
          </View>
        </View>
        <AtMessage />
      </BaseView>
    );
  }
}
