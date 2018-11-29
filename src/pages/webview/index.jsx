import Taro, { Component } from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

const mapStateToProps = state => {
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timebegin: new Date().getTime() - 3000,
      kind: 2,
      isme: true
    };
  }
  componentWillMount() {
    const params = this.$router.params;
    const { weburl, isSystem } = params;
    this.setState({ weburl, isSystem });
  }
  componentDidMount() {
    const { userinfo } = this.props.userReducer;
    const params = this.$router.params;
    const isme = params.userId == userinfo.userId;
    this.setState({ isme, articleId: params.articleId });
  }
  componentWillUnmount() {
    // this.postViewlog();
  }
  //上报数据
  postViewlog = () => {
    const { timebegin, kind, isme, articleId } = this.state;
    const duration = (new Date().getTime() - timebegin) / 1000;
    const postdata = {
      kind,
      sourceId: Number(articleId),
      duration: parseInt(duration)
    };
    !isme && Taro.eventCenter.trigger("postViewlogs", postdata);
  };

  onShareAppMessage() {
    const { weburl } = this.state;
    return {
      path: `/pages/index?goto=webview&weburl=${weburl}`
    };
  }
  render() {
    let { weburl, isSystem } = this.state;
    let url = weburl;
    if (isSystem) {
      url = weburl + "?overcarte=1";
    }
    console.log(url);
    return <WebView src={url} />;
  }
}
