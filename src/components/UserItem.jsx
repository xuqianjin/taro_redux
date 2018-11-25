import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ImageView from "./ImageView";
import HeightView from "./HeightView";
import { AtAvatar, AtIcon, AtButton } from "taro-ui";
import moment from "moment";
import { changeSrc, countTypeText } from "../lib/utils";

export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    onSetIntent: () => {}
  };
  constructor(props) {
    super(props);
  }
  handleItemClick = e => {
    const { item } = this.props;
    this.props.onItemClick(item);
    e.stopPropagation();
  };
  handleSetIntent = e => {
    const { item } = this.props;
    this.props.onSetIntent(item);
    e.stopPropagation();
  };
  render() {
    const { item, type } = this.props;
    const { Visitor, numView, updatedAt } = item || {};
    const imgstyle = `margin:${Taro.pxTransform(20)}`;
    const descstyle = `font-size:${Taro.pxTransform(25)}`;
    return (
      <View
        className="at-row bg_white opacity at-row__align--center"
        onClick={this.handleItemClick}
      >
        <View style={imgstyle} className="at-col at-col-1 at-col--auto">
          <AtAvatar
            circle={true}
            image={changeSrc(Visitor && Visitor.avatarUrl)}
          />
        </View>
        <View className="at-row at-row__justify--between at-row__align--center">
          <View className="at-col">
            <HeightView height={20} color="transparent" />
            <View>{Visitor.nickName}</View>
            <HeightView height={10} color="transparent" />
            <View
              style={descstyle}
              className="at-row text_black_light at-row--wrap"
            >
              <Text>这是Ta第</Text>
              <Text>{numView}</Text>
              <Text>次访问你</Text>
              <Text>{countTypeText(numView)}</Text>
            </View>
            <HeightView height={20} color="transparent" />
          </View>
          <View
            style={imgstyle}
            className="at-col at-col-1 at-col--auto text_right text_black_light"
          >
            <View>{moment(updatedAt).calendar()}</View>
            {type && (
              <View
                style="padding-top:20px"
                className="text_theme"
                onClick={this.handleSetIntent.bind(this)}
              >
                设为意向
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
