import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import BaseView from "../../components/BaseView";
import moment from "moment";

import { AtNoticebar } from "taro-ui";

import "./style.scss";

import { postCharge } from "../../reducers/userReducer";
import { getVipKinds } from "../../reducers/commonReducer";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postCharge,
      getVipKinds
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
  config = {
    navigationBarTitleText: "购买会员"
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.getVipKinds();
  }
  handleClick = value => {
    const postdata = {
      kind: value,
      channel: "WX_LITE"
    };
    this.props
      .postCharge(postdata)
      .then(({ value }) => {
        return Taro.requestPayment(value);
      })
      .then(res => {
        Taro.showToast({ title: "购买成功" });
      });
  };
  render() {
    const { vipkinds } = this.props.commonReducer;
    const { userinfodetail } = this.props.userReducer;
    let condition = false;
    if (vipkinds && userinfodetail) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const { vipEndAt } = userinfodetail || {};
    const [item1, item2] = vipkinds || [];
    return (
      <BaseView condition={condition}>
        {vipEndAt && (
          <AtNoticebar marquee={true}>{`尊敬的会员您好,您的有效期到${moment(
            vipEndAt
          ).format("YYYY-MM-DD")},可续费`}</AtNoticebar>
        )}
        <ImageView
          baseclassname="image"
          src={`${CDN_URL}intro_banner.jpg`}
          mode="widthFix"
        />
        <View className="at-row bg_white">
          <View
            className="at-col buy orange"
            onClick={this.handleClick.bind(this, item1.id)}
          >
            <View>{item1.name}</View>
            <View className="money">¥{item1.money}</View>
            <View>
              <Text className="button">{vipEndAt ? "续费" : "立即购买"}</Text>
            </View>
          </View>
          <View
            className="at-col buy orangelight"
            onClick={this.handleClick.bind(this, item2.id)}
          >
            <View>{item2.name}</View>
            <View className="money">¥{item2.money}</View>
            <View>
              <Text className="button">{vipEndAt ? "续费" : "立即购买"}</Text>
            </View>
          </View>
        </View>
        <ImageView
          baseclassname="image"
          src={`${CDN_URL}intro_vip_privileges.jpg`}
          mode="widthFix"
        />
        <ImageView
          baseclassname="image"
          src={`${CDN_URL}intro_vip_privileges_2.jpg`}
          mode="widthFix"
        />
      </BaseView>
    );
  }
}
