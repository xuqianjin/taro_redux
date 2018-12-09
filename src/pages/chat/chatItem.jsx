import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
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

  onForcePush = () => {
    const { isme, item, avatar } = this.props;
    this.props.onForcePush(item);
  };
  render() {
    const { isme, item, avatar } = this.props;
    const from = (
      <View>
        <View className="time text_black_light text_center">
          {moment(item.createdAt).calendar()}
        </View>
        <View className="at-row">
          <View className="at-col at-col-1 at-col--auto avatar">
            <AtAvatar image={avatar || defaultavatar} />
          </View>
          <View
            className="at-col at-col-8"
            style="display: flex;align-items: center;"
          >
            <View className="message">
              <Text selectable={true} className="at-col--wrap">
                {item.content}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
    const me = (
      <View>
        <View className="time text_black_light text_center">
          {moment(item.createdAt).calendar()}
        </View>
        <View className="at-row  at-row__justify--end">
          <View
            className="at-col at-col-8"
            style="display:flex;flex-direction:column;align-items:flex-end;"
          >
            <View style="display: flex;align-items: center;justify-content:flex-end">
              <View className="messageme">
                <Text selectable={true} className="at-col--wrap">
                  {item.content}
                </Text>
              </View>
            </View>
            <View className="pushmessage" onClick={this.onForcePush}>
              推至客户
            </View>
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
