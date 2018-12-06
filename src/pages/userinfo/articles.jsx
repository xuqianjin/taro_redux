import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, ScrollView } from "@tarojs/components";
import {
  AtTabBar,
  AtTabs,
  AtTabsPane,
  AtLoadMore,
  AtIcon,
  AtCheckbox
} from "taro-ui";

import ArticleItem from "../article/ArticleItem";
import HeightView from "../../components/HeightView";
import {
  getSysArticle,
  getUserArticleMy,
  getUserArticleCollect,
  putUserArticleStar,
  putUserArticleUnStar
} from "../../reducers/articleReducer";
import { getTags } from "../../reducers/commonReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    articleReducer: state.articleReducer,
    commonReducer: state.commonReducer,
    userReducer: state.userReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserArticleMy,
      getUserArticleCollect,
      getSysArticle,
      putUserArticleStar,
      putUserArticleUnStar,
      getTags
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "我的文章"
  };
  constructor(props) {
    super(props);
    this.state = {
      userarticle: "",
      articleTag: [],
      chooseids: [],
      hasMore: true
    };
    this.page = {
      pageNo: 0,
      pageSize: 10
    };
  }
  componentWillMount() {
    this.props.getTags({ kind: 2 }).then(res => {
      this.setState({ articleTag: res.value });
    });
    this.requestList();
  }
  handleChoose = item => {
    const { chooseids } = this.state;
    if (chooseids.includes(item.id)) {
      chooseids.splice(chooseids.indexOf(item.id), 1);
    } else {
      chooseids.push(item.id);
    }
    this.setState({ chooseids });
  };
  requestList = () => {
    if (!this.state.hasMore) {
      return;
    }
    this.props.getUserArticleMy(this.page).then(({ value }) => {
      const { userarticle } = this.state;
      const { usercartedesc } = this.props.userReducer;
      const { articles } = usercartedesc;
      const chooseids = articles.map(item => item.id);

      this.setState({
        chooseids,
        userarticle: userarticle ? userarticle.concat(value) : value
      });

      if (value.length < this.page.pageSize) {
        this.setState({ hasMore: false });
      }
    });
  };
  onScrollToLower = () => {
    this.page.pageNo++;
    this.requestList();
  };
  submit = () => {
    const { chooseids } = this.state;
    const { usercartedesc } = this.props.userReducer;
    const { articles } = usercartedesc;
    const orderids = articles.map(item => item.id);
    Taro.showLoading();
    const promise = Promise.resolve();
    promise
      .then(res => {
        if (orderids.length > 0) {
          return this.props.putUserArticleUnStar({ ids: orderids });
        } else {
          return "success";
        }
      })
      .then(res => {
        if (chooseids.length > 0) {
          return this.props.putUserArticleStar({ ids: chooseids });
        } else {
          return res;
        }
      })
      .then(res => {
        Taro.eventCenter.trigger("getUserCarte");
        Taro.navigateBack();
        Taro.hideLoading();
      })
      .catch(err => {});
  };
  render() {
    const { userarticle, articleTag, chooseids } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 100
    );
    return (
      <View>
        <ScrollView
          scrollY={true}
          style={`height:${scrollheight}`}
          onScrollToLower={this.onScrollToLower}
        >
          <HeightView height={10} />
          {userarticle &&
            userarticle.map((item, index) => {
              return (
                <ArticleItem
                  key={item.id}
                  showChoose={true}
                  isChoose={chooseids.includes(item.id)}
                  item={item}
                  line={true}
                  onClick={this.handleChoose.bind(this, item)}
                />
              );
            })}
          <AtLoadMore status={"noMore"} />
        </ScrollView>
        <View
          style={`display:fixed;bottom:0;width:100%;height:${Taro.pxTransform(
            100
          )};line-height:2.5;color:white`}
          className="bg_theme text_center"
          onClick={this.submit}
        >
          提交
        </View>
      </View>
    );
  }
}
