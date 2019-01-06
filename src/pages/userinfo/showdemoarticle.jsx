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

import DemoItem from "../demo/DemoItem";
import ArticleItem from "../article/ArticleItem";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import {
  getDemoCreate,
  putDemoStar,
  putDemoUnStar
} from "../../reducers/demoReducer";

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
      getDemoCreate,
      putDemoStar,
      putDemoUnStar
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
    navigationBarTitleText: "更多"
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  handleArticleClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/index?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  handleDemoClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/demo?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  render() {
    const { usercartedesc } = this.props.userReducer;
    const { demos, articles } = usercartedesc;
    const params = this.$router.params;
    return (
      <BaseView>
        {params.type == 1 ? (
          <View className="at-row at-row--wrap">
            {demos.map((item, index) => {
              return (
                <DemoItem
                  key={item.id}
                  item={item}
                  line={true}
                  onClick={this.handleDemoClick.bind(this, item)}
                />
              );
            })}
          </View>
        ) : (
          articles.map((item, index) => {
            return (
              <ArticleItem
                key={item.id}
                item={item}
                line={true}
                onClick={this.handleArticleClick.bind(this, item)}
              />
            );
          })
        )}
        <AtLoadMore status={"noMore"} />
      </BaseView>
    );
  }
}
