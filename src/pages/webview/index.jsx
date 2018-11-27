import Taro, { Component } from "@tarojs/taro";
import { WebView } from "@tarojs/components";

export default class extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const params = this.$router.params;
    const { weburl } = params;
    this.setState({ weburl });
  }
  render() {
    const { weburl } = this.state;
    return <WebView src={weburl} />;
  }
}
