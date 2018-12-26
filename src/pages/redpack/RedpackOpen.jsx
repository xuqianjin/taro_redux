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
    const style = `background: url(${CDN_URL}hblq.png) no-repeat; background-size: 100% 100%;`;
    return (
      <View className="redpackOpen" style={style}>
        <View className="redpackOpenContent">水电费第三方</View>
      </View>
    );
  }
}
