import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View, Button, Text, Input } from "@tarojs/components";
import { AtAvatar, AtIcon, AtLoadMore } from "taro-ui";

import { countTypeText } from "../../lib/utils";
import moment from "moment";
import BaseView from "../../components/BaseView";
import { changeSrc } from "../../lib/utils";
import { getViewlogs } from "../../reducers/customerReducer";
import "./style.scss";

const mapStateToProps = state => {
  return {
    customerReducer: state.customerReducer
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
  }
  componentWillMount() {
    this.props.getViewlogs();
  }
  handleClick = item => {
    const { Visitor, visitorId } = item;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${visitorId}&avatarUrl=${
        Visitor.avatarUrl
      }&nickName=${Visitor.nickName}`
    });
  };
  render() {
    const { viewlogs } = this.props.customerReducer;
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
    const imgstyle = `margin:${Taro.pxTransform(20)}`;
    return (
      <BaseView condition={condition}>
        {viewlogs &&
          viewlogs.map(viewlog => {
            const {
              Visitor,
              numView,
              updatedAt,
              duration,
              kind,
              count
            } = viewlog;

            return (
              <View
                key={viewlog.id}
                className="at-row bg_white opacity content shadow"
                onClick={this.handleClick.bind(this, viewlog)}
              >
                <View style={imgstyle} className="at-col at-col-1 at-col--auto">
                  <AtAvatar
                    circle={true}
                    image={changeSrc(Visitor && Visitor.avatarUrl)}
                  />
                </View>
                <View className="at-col">
                  <View className="at-row at-row__justify--between">
                    <View className="at-col at-col-1 at-col--auto title">
                      {Visitor.nickName}
                    </View>
                    <View className="at-col at-col-1 at-col--auto text_black_light time">
                      {moment(Visitor.createdAt).calendar()}
                    </View>
                  </View>
                  <View className="desc at-col--wrap text_black_light">
                    <Text>在你的</Text>
                    <Text className="text_theme">{kindtype[kind]}</Text>
                    <Text>停留了</Text>
                    <Text className="text_theme">{duration}</Text>
                    <Text>秒,这是他第</Text>
                    <Text className="text_theme">{count}</Text>
                    <Text>访问你</Text>
                    <Text>{countTypeText(count)}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        <AtLoadMore status={"noMore"} />
      </BaseView>
    );
  }
}
