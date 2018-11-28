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
    const { weburl } = params;
    this.setState({ weburl });
  }
  componentDidMount() {
    const { userinfo } = this.props.userReducer;
    const params = this.$router.params;
    const isme = params.userId == userinfo.userId;
    this.setState({ isme, pageuserid: params.userId });
  }
  componentWillUnmount() {
    this.postViewlog();
  }
  //上报数据
  postViewlog = () => {
    const { timebegin, kind, isme, pageuserid } = this.state;
    const duration = (new Date().getTime() - timebegin) / 1000;
    const postdata = {
      kind,
      sourceId: Number(pageuserid),
      duration: parseInt(duration)
    };
    !isme && Taro.eventCenter.trigger("postViewlogs", postdata);
  };

  onShareAppMessage() {
    const params = this.$router.params;
    const { weburl } = params;
    var pages = Taro.getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return {
      path: `/pages/index?path=/${url}&weburl=${weburl}`
    };
  }
  render() {
    const { weburl } = this.state;
    return <WebView src={weburl} />;
  }
}
