import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import moment from "moment";

import ImageView from "../../components/ImageView";
import { AtAvatar } from "taro-ui";

const defaultavatar = require("../../static/icon/avatar.png");

export default class extends Component {
  static defaultProps = { item: {} };
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { isme, item, avatar } = this.props;
    const from = (
      <View>
        <View className="time text_black_light text_center">
          {moment(item.time).calendar()}
        </View>
        <View className="at-row">
          <View className="at-col at-col-1 at-col--auto avatar">
            <AtAvatar image={avatar || defaultavatar} />
          </View>
          <View className="at-col at-col-1 at-col--auto at-col--wrap">
            <View className="message">{item.text}</View>
          </View>
        </View>
      </View>
    );
    const me = (
      <View>
        <View className="time text_black_light text_center">
          {moment(item.time).calendar()}
        </View>
        <View className="at-row  at-row__justify--end">
          <View className="at-col at-col-1 at-col--auto at-col--wrap">
            <View className="messageme">{item.text}</View>
          </View>
          <View className="at-col at-col-1 at-col--auto avatar">
            <AtAvatar image={avatar || defaultavatar} />
          </View>
        </View>
      </View>
    );
    return isme ? me : from;
  }
}
