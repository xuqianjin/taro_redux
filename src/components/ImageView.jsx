import Taro, { Component } from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { changeSrc } from "../lib/utils";
const nopic = require("../static/image/noPicture.png");

export default class extends Component {
  static externalClasses = ["baseclassname"];

  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src
    };
  }
  static defaultProps = {
    onClick: () => {}
  };
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({ src: nextProps.src });
    }
  }
  onError = () => {
    this.setState({ src: nopic });
  };

  render() {
    const { src } = this.state;
    const { basestyle, mode, onClick } = this.props;

    //  小程序bug兼容 https://nervjs.github.io/taro/docs/component-style.html
    var className = "baseclassname";
    if (process.env.TARO_ENV !== "weapp") {
      className = this.props.baseclassname;
    }

    return (
      <Image
        onClick={onClick}
        src={changeSrc(src)}
        onError={this.onError}
        className={className}
        style={basestyle}
        mode={mode}
      />
    );
  }
}
