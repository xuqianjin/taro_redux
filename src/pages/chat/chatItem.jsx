import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import ImageView from "../../components/ImageView";
import { AtAvatar } from "taro-ui";

export default class extends Component {
  static defaultProps = {};
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { messagetype } = this.props;
    const from = (
      <View>
        <View className="time text_black_light text_center">1919119</View>
        <View className="at-row">
          <View className="at-col at-col-1 at-col--auto avatar">
            <AtAvatar image="https://jdc.jd.com/img/200" />
          </View>
          <View className="at-col at-col-1 at-col--auto at-col--wrap">
            <View className='message'>message</View>
          </View>
        </View>
      </View>
    );
    const me = (
      <View>
        <View className="time text_black_light text_center">1919119</View>
        <View className="at-row  at-row__justify--end">
          <View className="at-col at-col-1 at-col--auto at-col--wrap">
            <View className='messageme'>紫色方式发顺丰沙发斯蒂芬斯蒂芬是否S对方是否第三方是否水电费是否水电费沙发沙发斯蒂芬是双方当时的方式发生师傅师傅的说法舒服舒服</View>
          </View>
          <View className="at-col at-col-1 at-col--auto avatar">
            <AtAvatar image="https://jdc.jd.com/img/200" />
          </View>
        </View>
      </View>
    );
    return messagetype === 0 ? from : me;
  }
}
