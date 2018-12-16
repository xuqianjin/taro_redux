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
    navigationBarTitleText: "我的文章"
  };
  constructor(props) {
    super(props);
    this.state = {
      userdemo: "",
      chooseids: [],
      hasMore: true
    };
    this.page = {
      pageNo: 0,
      pageSize: 10
    };
  }
  componentWillMount() {
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
    this.props.getDemoCreate(this.page).then(({ value }) => {
      const { userdemo } = this.state;
      const { usercartedesc } = this.props.userReducer;
      const { demos } = usercartedesc;
      const chooseids = demos.map(item => item.id);

      this.setState({
        chooseids,
        userdemo: userdemo ? userdemo.concat(value) : value
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
    const { demos } = usercartedesc;
    const orderids = demos.map(item => item.id);
    Taro.showLoading();
    const promise = Promise.resolve();
    promise
      .then(res => {
        if (orderids.length > 0) {
          return this.props.putDemoUnStar({ ids: orderids });
        } else {
          return "success";
        }
      })
      .then(res => {
        if (chooseids.length > 0) {
          return this.props.putDemoStar({ ids: chooseids });
        } else {
          return res;
        }
      })
      .then(res => {
        Taro.eventCenter.trigger("getUserCarteDesc");
        Taro.navigateBack();
        Taro.hideLoading();
      })
      .catch(err => {});
  };
  render() {
    const { userdemo, articleTag, chooseids } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 100
    );
    return (
      <BaseView>
        <ScrollView
          scrollY={true}
          style={`height:${scrollheight}`}
          onScrollToLower={this.onScrollToLower}
        >
          <HeightView height={10} />
          <View className="at-row at-row--wrap">
            {userdemo &&
              userdemo.map((item, index) => {
                return (
                  <DemoItem
                    key={item.id}
                    showChoose={true}
                    isChoose={chooseids.includes(item.id)}
                    item={item}
                    line={true}
                    onClick={this.handleChoose.bind(this, item)}
                  />
                );
              })}
          </View>
          <AtLoadMore status={"noMore"} />
        </ScrollView>
        <View
          style={`position:fixed;bottom:0;width:100%;height:${Taro.pxTransform(
            100
          )};color:white;display:flex;align-items:center;justify-content:center;font-size:35rpx`}
          className="bg_theme text_center"
          onClick={this.submit}
        >
          提交
        </View>
      </BaseView>
    );
  }
}
