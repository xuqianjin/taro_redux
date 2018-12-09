import Taro, { Component } from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { getArticle } from "../../reducers/articleReducer";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    articleReducer: state.articleReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getArticle }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const params = this.$router.params;
    console.log(params);
    const { overcarte, id } = params;
    const weburl = `${API_HOST}/article/${id}`;
    this.props.getArticle(id).then(({ value }) => {
      this.setState({ articleitem: value });
    });
    this.setState({ weburl, overcarte: Number(overcarte), id });
  }
  componentDidMount() {}
  componentWillUnmount() {}

  onShareAppMessage() {
    var { userinfo } = this.props.userReducer;
    var { weburl, id, articleitem } = this.state;
    var { nickName } = articleitem.User;
    let sharecontent = {};
    if (
      this.share &&
      this.share.currentTarget &&
      this.share.currentTarget.data &&
      this.share.currentTarget.data.length > 0
    ) {
      const content = this.share.currentTarget.data[
        this.share.currentTarget.data.length - 1
      ];
      sharecontent.title = content.title;
      sharecontent.imageUrl = content.imageUrl;
      id = content.id;
      nickName = content.name;
    }
    sharecontent.path = `/pages/index?goto=article&id=${id}&name=${nickName}&userId=${
      userinfo.userId
    }`;
    console.log(sharecontent);
    return sharecontent;
  }
  bindMessage = data => {
    console.log("postmessage", data);
    this.share = data;
  };
  render() {
    let { weburl, overcarte, articleitem } = this.state;
    let url = weburl;
    if (overcarte) {
      url = weburl + "?overcarte=1";
    }
    return <WebView src={url} onMessage={this.bindMessage} />;
  }
}
