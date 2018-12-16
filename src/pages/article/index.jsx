import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, ScrollView } from "@tarojs/components";
import { AtTabBar, AtTabs, AtTabsPane, AtLoadMore, AtIcon } from "taro-ui";

import ArticleItem from "./ArticleItem";
import HeightView from "../../components/HeightView";
import {
  getSysArticle,
  getUserArticleMy,
  getUserArticleCollect
} from "../../reducers/articleReducer";
import { getTags } from "../../reducers/commonReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    articleReducer: state.articleReducer,
    commonReducer: state.commonReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserArticleMy,
      getUserArticleCollect,
      getSysArticle,
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
    navigationBarTitleText: "获客文章"
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      choosetag: -1,
      chooseuser: 0,
      userarticle: "",
      userarticlefunc: "",
      sysarticle: "",
      articleTag: [],
      syshasMore: true,
      myhasMore: true
    };
    this.syspage = {
      pageNo: 0,
      pageSize: 10
    };
    this.mypage = {
      pageNo: 0,
      pageSize: 10
    };
    this.usertag = [
      {
        name: "我的上传",
        ownKind: 1,
        func: this.props.getUserArticleMy
      },
      {
        name: "我的转发",
        ownKind: 2,
        func: this.props.getUserArticleMy
      },
      {
        name: "我的收藏",
        ownKind: 3,
        func: this.props.getUserArticleCollect
      }
    ];
  }
  componentWillMount() {
    this.props.getTags({ kind: 2 }).then(res => {
      this.setState({ articleTag: res.value });
    });
    this.requestSysList();
    Taro.eventCenter.on("getUserArticleCreate", () => {
      this.setState({ userarticle: "", chooseuser: 0, myhasMore: true }, () => {
        this.mypage.pageNo = 0;
        this.requestMyList();
      });
    });
    Taro.eventCenter.trigger("getUserArticleCreate");
  }
  componentWillUnmount() {
    Taro.eventCenter.off("getUserArticleCreate");
  }
  requestSysList = () => {
    const { choosetag } = this.state;
    if (!this.state.syshasMore) {
      return;
    }
    const params = Object.assign(
      {},
      this.syspage,
      choosetag > 0 && { tagId: choosetag }
    );

    this.props.getSysArticle(params).then(({ value }) => {
      const { sysarticle } = this.state;
      this.setState({
        sysarticle: sysarticle ? sysarticle.concat(value) : value
      });
      if (value.length < this.syspage.pageSize) {
        this.setState({
          syshasMore: false
        });
      }
    });
  };
  requestMyList = () => {
    const { chooseuser } = this.state;
    const { func, ownKind } = this.usertag[chooseuser];
    if (!this.state.myhasMore) {
      return;
    }
    const params = Object.assign({}, this.mypage, { ownKind });
    func(params).then(({ value }) => {
      const { userarticle } = this.state;
      this.setState({
        userarticle: userarticle ? userarticle.concat(value) : value
      });
      if (value.length < this.mypage.pageSize) {
        this.setState({
          myhasMore: false
        });
      }
    });
  };
  handleChangeTab = value => {
    this.setState({ current: value });
  };
  handleTagClick = id => {
    const { choosetag } = this.state;
    this.syspage.pageNo = 0;
    if (id == choosetag) {
      this.setState(
        { choosetag: -1, sysarticle: "", syshasMore: true },
        this.requestSysList
      );
    } else {
      this.setState(
        { choosetag: id, sysarticle: "", syshasMore: true },
        this.requestSysList
      );
    }
  };
  handleUserClick = index => {
    const { chooseuser } = this.state;
    this.mypage.pageNo = 0;
    this.setState(
      { chooseuser: index, userarticle: "", myhasMore: true },
      this.requestMyList
    );
  };
  handUpload = () => {
    Taro.navigateTo({ url: "/pages/article/upload" });
  };
  handleItemClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/index?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  onSysScrollToLower = () => {
    this.syspage.pageNo++;
    this.requestSysList();
  };
  onMyScrollToLower = () => {
    this.mypage.pageNo++;
    this.requestMyList();
  };
  render() {
    const {
      choosetag,
      chooseuser,
      userarticle,
      sysarticle,
      articleTag,
      syshasMore,
      myhasMore
    } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const tabList = [
      {
        title: "全部文章"
      },
      {
        title: "我的文章"
      }
    ];

    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 160
    );
    return (
      <View>
        <AtTabs
          className="attabs"
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleChangeTab.bind(this)}
          swipeable={false}
        >
          <AtTabsPane current={this.state.current} index={0}>
            <View className="at-row bg_white fixtag">
              {articleTag.map(tag => {
                let color =
                  tag.id == choosetag ? "text_black" : "text_black_light";
                return (
                  <View
                    className={`at-col text_center ${color}`}
                    key={tag.id}
                    onClick={this.handleTagClick.bind(this, tag.id)}
                  >
                    {tag.name}
                  </View>
                );
              })}
            </View>
            <ScrollView
              scrollY={true}
              style={`height:${scrollheight}`}
              onScrollToLower={this.onSysScrollToLower}
            >
              <HeightView height={10} />
              {sysarticle &&
                sysarticle.map((item, index) => {
                  return (
                    <ArticleItem
                      key={item.id}
                      item={item}
                      line={index < sysarticle.length - 1}
                      onClick={this.handleItemClick.bind(this, item)}
                    />
                  );
                })}
              <AtLoadMore status={syshasMore ? "loading" : "noMore"} />
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="at-row bg_white fixtag">
              {this.usertag.map((tag, index) => {
                let color =
                  index == chooseuser ? "text_black" : "text_black_light";
                return (
                  <View
                    className={`at-col text_center ${color}`}
                    key={tag.value}
                    onClick={this.handleUserClick.bind(this, index)}
                  >
                    {tag.name}
                  </View>
                );
              })}
            </View>
            <ScrollView
              scrollY={true}
              style={`height:${scrollheight}`}
              onScrollToLower={this.onMyScrollToLower}
            >
              <HeightView height={10} />
              {userarticle &&
                userarticle.map((item, index) => {
                  return (
                    <ArticleItem
                      key={item.id}
                      item={item}
                      line={index < userarticle.length - 1}
                      onClick={this.handleItemClick.bind(this, item)}
                    />
                  );
                })}
              <AtLoadMore status={myhasMore ? "loading" : "noMore"} />
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
        <View className="fix bg_theme" onClick={this.handUpload}>
          <AtIcon value="share-2" size={18} />
          <HeightView height={5} color="transparent" />
          <Text>上传文章</Text>
        </View>
      </View>
    );
  }
}
