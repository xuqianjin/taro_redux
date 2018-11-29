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
      isme: true,
      share: ""
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
    let sharecontent = {
      path: `/pages/index?goto=webview&weburl=${weburl}`
    };
    if (
      this.share &&
      this.share.currentTarget &&
      this.share.currentTarget.data &&
      this.share.currentTarget.data.length > 0
    ) {
      const content = this.share.currentTarget.data[0];
      sharecontent.title = content.title;
      sharecontent.imageUrl = content.imageUrl;
    }
    return sharecontent;
  }
  bindMessage = data => {
    this.share = data;
  };
  render() {
    let { weburl, isSystem } = this.state;
    let url = weburl;
    if (isSystem) {
      url = weburl + "?overcarte=1";
    }
    return <WebView src={url} onMessage={this.bindMessage} />;
  }
}
