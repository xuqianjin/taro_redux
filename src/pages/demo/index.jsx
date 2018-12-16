import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { AtTabBar, AtTabs, AtTabsPane, AtLoadMore, AtIcon } from "taro-ui";

import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import { getDemoCreate, getDemoCollect } from "../../reducers/demoReducer";

import {
  roomStyle,
  houseKind,
  roomKind,
  demoKind
} from "../../components/Constant";
import { getNameByValue } from "../../lib/utils";
import "./style.scss";
import DemoItem from "./DemoItem";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    demoReducer: state.demoReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getDemoCreate, getDemoCollect }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "获客案例"
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      chooseuser: 0,
      userdemo: "",
      myhasMore: true
    };
    this.mypage = {
      pageNo: 0,
      pageSize: 10
    };
    this.usertag = [
      {
        name: "我的上传",
        func: this.props.getDemoCreate
      },
      {
        name: "我的收藏",
        func: this.props.getDemoCollect
      }
    ];
  }
  componentWillMount() {
    Taro.eventCenter.on("getUserDemoCreate", () => {
      this.setState({ userdemo: "", chooseuser: 0, myhasMore: true }, () => {
        this.mypage.pageNo = 0;
        this.requestMyList();
      });
    });
    Taro.eventCenter.trigger("getUserDemoCreate");
  }
  componentWillUnmount() {
    Taro.eventCenter.off("getUserDemoCreate");
  }
  requestMyList = () => {
    const { chooseuser } = this.state;
    const { func } = this.usertag[chooseuser];
    if (!this.state.myhasMore) {
      return;
    }
    const params = Object.assign({}, this.mypage, {});
    func(params).then(({ value }) => {
      const { userdemo } = this.state;
      this.setState({
        userdemo: userdemo ? userdemo.concat(value) : value
      });
      if (value.length < this.mypage.pageSize) {
        this.setState({
          myhasMore: false
        });
      }
    });
  };
  handleUserClick = index => {
    const { chooseuser } = this.state;
    this.mypage.pageNo = 0;
    this.setState(
      { chooseuser: index, userdemo: "", myhasMore: true },
      this.requestMyList
    );
  };
  handleItemClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/demo?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  handUpload = () => {
    Taro.navigateTo({ url: "/pages/demo/upload" });
  };
  onMyScrollToLower = () => {
    this.mypage.pageNo++;
    this.requestMyList();
  };
  render() {
    const { chooseuser, userdemo, myhasMore } = this.state;
    const { deviceinfo } = this.props.commonReducer;
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth - 80
    );
    return (
      <View>
        <View className="attabs">
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
            <View className="at-row at-row--wrap">
              {userdemo &&
                userdemo.map((item, index) => {
                  return (
                    <DemoItem
                      key={item.id}
                      item={item}
                      line={index < userdemo.length - 1}
                      onClick={this.handleItemClick.bind(this, item)}
                    />
                  );
                })}
            </View>
            <AtLoadMore status={myhasMore ? "loading" : "noMore"} />
          </ScrollView>
        </View>
        <View className="fix bg_theme" onClick={this.handUpload}>
          <AtIcon value="share-2" size={18} />
          <HeightView height={5} color="transparent" />
          <Text>上传案例</Text>
        </View>
      </View>
    );
  }
}
