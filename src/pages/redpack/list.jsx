import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import {
  AtTabBar,
  AtTabs,
  AtTabsPane,
  AtLoadMore,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent
} from "taro-ui";

import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import {
  getRedPackSend,
  getRedPackReceive
} from "../../reducers/redpackReducer";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    redpackReducer: state.redpackReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRedPackSend, getRedPackReceive }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "红包记录",
    navigationBarBackgroundColor: "#d65c44"
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      chooseuser: 0,
      redpacklist: "",
      myhasMore: true
    };
    this.mypage = {
      pageNo: 0,
      pageSize: 10
    };
    this.usertag = [
      {
        name: "我收到的",
        func: this.props.getRedPackReceive
      },
      {
        name: "我发出的",
        func: this.props.getRedPackSend
      }
    ];
  }
  componentWillMount() {
    Taro.eventCenter.on("getUserRedpack", () => {
      this.setState({ redpacklist: "", chooseuser: 0, myhasMore: true }, () => {
        this.mypage.pageNo = 0;
        this.requestMyList();
      });
    });
    Taro.eventCenter.trigger("getUserRedpack");
  }
  componentWillUnmount() {
    Taro.eventCenter.off("getUserRedpack");
  }
  requestMyList = () => {
    const { chooseuser } = this.state;
    const { func } = this.usertag[chooseuser];
    if (!this.state.myhasMore) {
      return;
    }
    const params = Object.assign({}, this.mypage, {});
    func(params).then(({ value }) => {
      const { redpacklist } = this.state;
      this.setState({
        redpacklist: redpacklist ? redpacklist.concat(value) : value
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
      { chooseuser: index, redpacklist: "", myhasMore: true },
      this.requestMyList
    );
  };
  handleItemClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/demo?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  handleTypeClick = item => {
    switch (item.value) {
      case 1:
        Taro.navigateTo({ url: `/pages/demo/uploadh?kind=${item.value}` });
        break;
      case 2:
        Taro.navigateTo({ url: `/pages/demo/uploadm?kind=${item.value}` });
        break;
      default:
    }
  };
  onMyScrollToLower = () => {
    this.mypage.pageNo++;
    this.requestMyList();
  };
  render() {
    const { chooseuser, redpacklist, myhasMore } = this.state;
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
              {redpacklist &&
                redpacklist.map((item, index) => {
                  return (
                    <DemoItem
                      key={item.id}
                      item={item}
                      line={index < redpacklist.length - 1}
                      onClick={this.handleItemClick.bind(this, item)}
                    />
                  );
                })}
            </View>
            <AtLoadMore status={myhasMore ? "loading" : "noMore"} />
          </ScrollView>
        </View>
      </View>
    );
  }
}