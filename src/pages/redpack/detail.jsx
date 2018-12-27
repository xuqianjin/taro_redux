import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import moment from "moment";

import { AtLoadMore, AtCurtain, AtMessage } from "taro-ui";
import { View, ScrollView } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";
import {
  getRedPackDetail,
  getRedPackOpen
} from "../../reducers/redpackReducer";
import RedpackCenter from "./RedpackCenter";
import RedpackOpen from "./RedpackOpen";
import ListItem from "./ListItem";
import "./style.scss";

const redpack_default = require("../../static/icon/redpack_default.png");
const redpack_money = require("../../static/icon/redpack_money.png");
const redpack_share = require("../../static/icon/redpack_share.png");

const statusmap = {
  0: "该红包未支付",
  1: "领取红包",
  2: "该红包已领完",
  3: "该红包已过期"
};
const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRedPackDetail, getRedPackOpen }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "红包详情",
    navigationBarBackgroundColor: "#d65c44"
  };
  constructor(props) {
    super(props);
    this.state = {
      redpack: "",
      openRedpack: "",
      showopenRedpack: false
    };
  }
  componentWillMount() {
    this.requstRedpack();
  }
  handleRedpackOpen = () => {
    const { openRedpack, redpack } = this.state;
    const { redpackId } = this.$router.params;
    if (redpack.status !== 1) {
      return;
    }
    if (openRedpack) {
      this.showOpen();
      return;
    }
    Taro.showLoading();
    this.props
      .getRedPackOpen(redpackId)
      .then(res => {
        Taro.hideLoading();
        this.requstRedpack(true);
      })
      .catch(err => {
        Taro.atMessage({ message: err.message, type: "error" });
        Taro.hideLoading();
      });
  };
  requstRedpack = showme => {
    const { userinfo } = this.props.userReducer;
    const { redpackId } = this.$router.params;
    this.props.getRedPackDetail(redpackId).then(({ value }) => {
      const { RedpackPieces } = value;
      const openRedpack = RedpackPieces.find(
        item => item.Receiver.id === userinfo.userId
      );
      this.setState({ redpack: value, openRedpack });
      showme && this.showOpen();
    });
  };
  showOpen = () => {
    const { openRedpack } = this.state;
    this.setState({ showopenRedpack: true });
  };
  closeOpen = () => {
    this.setState({ showopenRedpack: false });
  };
  render() {
    const { redpack, showopenRedpack, openRedpack } = this.state;
    const { User, RedpackPieces } = redpack || {};
    const { deviceinfo } = this.props.commonReducer;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 400 - 20
    );
    let condition = false;
    if (redpack) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    return (
      <BaseView baseclassname="content" condition={condition}>
        <AtMessage />
        <RedpackCenter
          avatarUrl={User.avatarUrl}
          whitestyle="background-color:transparent"
          redstyle="box-shadow:none"
        />
        <View className="body">
          <View className="infoblock" style="background-color:#d65c44">
            <View>
              <Text className="text_white">{User.nickName + "的名片红包"}</Text>
            </View>
            <View className="detailbutton">{statusmap[redpack.status]}</View>
            <View className="at-row">
              <View className="at-col text_center text_white">
                <ImageView
                  src={redpack_money}
                  baseclassname="detailicon"
                  mode="widthFix"
                />
                去提现
              </View>
              <View className="at-col text_center text_white">
                <ImageView
                  src={redpack_default}
                  baseclassname="detailicon"
                  mode="widthFix"
                />
                再发一个
              </View>
              <View className="at-col text_center text_white">
                <ImageView
                  src={redpack_share}
                  baseclassname="detailicon"
                  mode="widthFix"
                />
                去转发
              </View>
            </View>
          </View>
          <ScrollView
            scrollY={true}
            style={`height:${scrollheight}`}
            className="body"
          >
            <View className="text_center">
              <HeightView height={20} color="transparent" />
              <View className="looktitle">看看大家手气如何</View>
              <HeightView height={10} color="transparent" />
              <View className="text_black_light" style="font-size:12px">
                {`共${redpack.money / 100}元,已领取${redpack.numTaken}/${
                  redpack.amount
                }个`}
              </View>
              <HeightView height={20} color="transparent" />
            </View>
            {RedpackPieces &&
              RedpackPieces.map((item, index) => {
                const avatarUrl = item.Receiver.avatarUrl;
                const nickName = item.Receiver.nickName;
                const createdAt = item.createdAt;
                const money = item.money / 100 + "元";
                return (
                  <ListItem
                    key={item.id}
                    avatarUrl={avatarUrl}
                    nickName={nickName}
                    createdAt={moment(createdAt).format("MM月DD日 HH:mm")}
                    money={money}
                  />
                );
              })}
          </ScrollView>
        </View>
        {openRedpack && (
          <AtCurtain
            isOpened={showopenRedpack}
            onClose={this.closeOpen.bind(this)}
          >
            <RedpackOpen
              redpackId={redpack.id}
              money={openRedpack.money / 100}
              onClose={this.closeOpen.bind(this)}
            />
          </AtCurtain>
        )}
      </BaseView>
    );
  }
}
