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
      chooseids: []
    };
  }
  componentWillMount() {
    this.props.getTags({ kind: 2 }).then(res => {
      this.setState({ articleTag: res.value });
    });
    Taro.eventCenter.on("getUserArticleCreate", () => {
      this.props.getUserArticleMy().then(res => {
        const { usercartedesc } = this.props.userReducer;
        const { articles } = usercartedesc;
        const chooseids = articles.map(item => item.id);

        this.setState({ userarticle: res.value, chooseids });
      });
    });

    Taro.eventCenter.trigger("getUserArticleCreate");
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
    const tabList = [
      {
        title: "全部文章"
      },
      {
        title: "我的文章"
      }
    ];
    const usertag = [
      {
        name: "我的上传",
        value: 1
      },
      {
        name: "我的收藏",
        value: 2
      },
      {
        name: "我的转发",
        value: 3
      }
    ];

    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 100
    );
    return (
      <View>
        <ScrollView scrollY={true} style={`height:${scrollheight}`}>
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
