import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ImageView from "./ImageView";
import HeightView from "./HeightView";
import { AtAvatar, AtIcon } from "taro-ui";
export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {};
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    Taro.navigateTo({ url: "/pages/chat/index" });
  };
  render() {
    const { height, color } = this.props;
    const imgstyle = `margin:${Taro.pxTransform(20)}`;
    const descstyle = `font-size:${Taro.pxTransform(25)}`;
    return (
      <View className="at-row bg_white opacity" onClick={this.handleClick}>
        <View style={imgstyle} className="at-col at-col-1 at-col--auto">
          <AtAvatar image="https://jdc.jd.com/img/300" />
        </View>
        <View className="at-row at-row__justify--between at-row__align--center">
          <View className="at-col">
            <View>用户姓名</View>
            <HeightView height={10} color="transparent" />
            <View style={descstyle} className="text_black_light">
              <AtIcon value="eye" size={15} />
              来访 0
            </View>
          </View>
          <View style={imgstyle} className="at-col text_right text_black_light">
            2018-9-8
          </View>
        </View>
      </View>
    );
  }
}
