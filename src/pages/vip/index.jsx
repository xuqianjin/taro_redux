import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import ImageView from "../../components/ImageView";

import "./style.scss";

import { postCharge } from "../../reducers/userReducer";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postCharge
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {
    height: 1,
    color: APP_COLOR_GRAY
  };
  constructor(props) {
    super(props);
  }
  handleClick = value => {
    this.props.postCharge();
    switch (value) {
      case 1:
        break;
      default:
    }
  };
  render() {
    return (
      <View>
        <ImageView
          baseclassname="image"
          src={require("../../static/image/vip1.jpeg")}
          mode="widthFix"
        />
        <View className="at-row bg_white">
          <View
            className="at-col buy orange"
            onClick={this.handleClick.bind(this, 1)}
          >
            <View>1年VIP会员</View>
            <View className="money">¥365.00</View>
            <View>
              <Text className="button">立即购买</Text>
            </View>
          </View>
          <View
            className="at-col buy orangelight"
            onClick={this.handleClick.bind(this, 2)}
          >
            <View>30天VIP会员</View>
            <View className="money">¥89.00</View>
            <View>
              <Text className="button">立即购买</Text>
            </View>
          </View>
        </View>
        <ImageView
          baseclassname="image"
          src={require("../../static/image/vip2.png")}
          mode="widthFix"
        />
        <ImageView
          baseclassname="image"
          src={require("../../static/image/vip3.png")}
          mode="widthFix"
        />
      </View>
    );
  }
}
