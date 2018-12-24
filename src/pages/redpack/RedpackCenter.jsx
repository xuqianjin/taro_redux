import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ImageView from "../../components/ImageView";
import "./style.scss";

export default class extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
  }

  render() {
    const { avatarUrl, basestyle, whitestyle, redstyle } = this.props;
    return (
      <View className="header" style={basestyle}>
        <View className="headerbgwhite" style={whitestyle} />
        <View className="headerbgred" style={redstyle} />
        {avatarUrl && <ImageView baseclassname="headerimg" src={avatarUrl} />}
      </View>
    );
  }
}
