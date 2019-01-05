import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import moment from "moment";
import ImageView from "../../components/ImageView";
import HeightView from "../../components/HeightView";
import { AtIcon } from "taro-ui";

import "./style.scss";
import { getArticle } from "../../reducers/articleReducer";

const mapStateToProps = state => {
  return { articleReducer: state.articleReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getArticle
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    item: {},
    onClick: () => {}
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { item, line, showChoose, isChoose, onClick } = this.props;
    const color = APP_COLOR_GRAY;
    const themecolor = APP_COLOR_THEME;
    return (
      <View className="bg_white opacity" onClick={onClick}>
        <HeightView height={20} color="transparent" />
        <View className="at-row articleitem">
          {showChoose && (
            <View className="at-col at-col-1 at-col--auto" onClick={onClick}>
              <AtIcon value={isChoose ? "star-2" : "star"} color={themecolor} />
            </View>
          )}
          <View className="at-col at-col--wrap">
            <View className="title">{item.title}</View>
            <View className="at-row text_black_light articledesc">
              <View className="at-col">阅读 {item.numView}</View>
              <View className="at-col">收藏 {item.numCollect}</View>
              <View className="at-col">转发 {item.numForward}</View>
              <View className="at-col">
                {moment(item.createdAt).format("YYYY-MM-DD")}
              </View>
            </View>
          </View>
          <View className="at-col at-col-1 at-col--auto">
            <ImageView baseclassname="img" src={item.thumbnail} />
          </View>
        </View>
        <HeightView height={20} color="transparent" />
        {line && <HeightView height={2} color={color} />}
      </View>
    );
  }
}
