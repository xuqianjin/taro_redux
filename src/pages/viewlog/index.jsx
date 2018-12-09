import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Button, Text, Input, ScrollView } from "@tarojs/components";
import { AtAvatar, AtIcon, AtLoadMore } from "taro-ui";

import { countTypeText } from "../../lib/utils";
import moment from "moment";
import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";
import { changeSrc } from "../../lib/utils";
import { getViewlogs } from "../../reducers/customerReducer";
import "./style.scss";

const mapStateToProps = state => {
  return {
    customerReducer: state.customerReducer,
    commonReducer: state.commonReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getViewlogs
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
    navigationBarTitleText: "访客日志"
  };
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true
    };
    this.page = {
      pageNo: 0,
      pageSize: 10
    };
  }
  componentWillMount() {
    this.props.customerReducer.viewlogs = "";
    this.requestList();
  }
  requestList = () => {
    if (!this.state.hasMore) {
      return;
    }
    this.props.getViewlogs(this.page).then(({ value }) => {
      if (value.length < this.page.pageSize) {
        this.setState({ hasMore: false });
      }
    });
  };
  onScrollToLower = () => {
    this.page.pageNo++;
    this.requestList();
  };
  handleClick = item => {
    const { Visitor, visitorId } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${visitorId}`
    });
  };
  dealTitle = title => {
    if (!title) {
      return "";
    }
    if (title.length > 17) {
      title = title.slice(0, 17);
      title = title + "...";
    }
    return `《${title}》`;
  };
  render() {
    const { viewlogs } = this.props.customerReducer;
    const { deviceinfo } = this.props.commonReducer;
    let condition = false;
    if (viewlogs) {
    } else {
      condition = {
        state: "viewLoading",
        tipsString: "加载中..."
      };
    }
    const kindtype = {
      1: "名片",
      2: "文章",
      3: "案例"
    };
    const scrollheight = Taro.pxTransform(
      (deviceinfo.windowHeight * 750) / deviceinfo.windowWidth
    );
    const imgstyle = `margin:${Taro.pxTransform(20)}`;
    const descstyle = `font-size:${Taro.pxTransform(25)}`;
    const marginright = `margin-right:${Taro.pxTransform(20)}`;
    return (
      <BaseView condition={condition}>
        <ScrollView
          style={`height:${scrollheight}`}
          scrollY={true}
          upperThreshold={100}
          onScrollToLower={this.onScrollToLower}
        >
          {viewlogs &&
            viewlogs.map(viewlog => {
              const {
                Visitor,
                duration,
                kind,
                count,
                createdAt,
                Source
              } = viewlog;
              return (
                <View key={viewlog.id}>
                  <View
                    className="at-row bg_white opacity at-row__align--center"
                    onClick={this.handleClick.bind(this, viewlog)}
                  >
                    <View
                      className="at-col at-col-1 at-col--auto"
                      style={imgstyle}
                    >
                      <AtAvatar
                        circle={true}
                        image={changeSrc(Visitor && Visitor.avatarUrl)}
                      />
                    </View>
                    <View className="at-col">
                      <HeightView height={10} color="transparent" />
                      <View className="at-row at-row__justify--between at-row__align--center">
                        <View className="at-col">{Visitor.nickName}</View>
                        <View
                          className="at-col text_right text_black_light"
                          style={marginright}
                        >
                          {moment(createdAt).calendar()}
                        </View>
                      </View>
                      <HeightView height={10} color="transparent" />
                      <View
                        style={descstyle}
                        className="at-row text_black_light at-row--wrap"
                      >
                        <Text>在你的</Text>
                        <Text className="text_theme">{kindtype[kind]}</Text>
                        <Text>{this.dealTitle(Source.title)}</Text>
                        <Text>停留了</Text>
                        <Text className="text_theme">{duration}</Text>
                        <Text>秒,这是他第</Text>
                        <Text className="text_theme">{count}</Text>
                        <Text>次访问你</Text>
                      </View>
                      <HeightView height={10} color="transparent" />
                    </View>
                  </View>
                  <HeightView height={10} color="transparent" />
                </View>
              );
            })}
          <AtLoadMore status={this.state.hasMore ? "loading" : "noMore"} />
        </ScrollView>
      </BaseView>
    );
  }
}
